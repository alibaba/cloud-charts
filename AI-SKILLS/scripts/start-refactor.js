#!/usr/bin/env node

/**
 * CloudCharts AI 重构启动器
 * 一键启动完整的 AI 驱动重构流程
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import readline from 'readline';

const ROOT = resolve(process.cwd());
const AI_SKILLS = join(ROOT, 'AI-SKILLS');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bold}[${step}]${colors.reset} ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// 交互式问答
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function askYesNo(question, defaultYes = true) {
  return new Promise(async (resolve) => {
    const suffix = defaultYes ? ' [Y/n]' : ' [y/N]';
    const answer = await ask(question + suffix);
    const normalized = answer.trim().toLowerCase();
    
    if (normalized === '') {
      resolve(defaultYes);
    } else {
      resolve(normalized === 'y' || normalized === 'yes');
    }
  });
}

function askChoice(question, choices, defaultIndex = 0) {
  return new Promise(async (resolve) => {
    console.log(`\n${question}`);
    choices.forEach((choice, index) => {
      const prefix = index === defaultIndex ? '→' : ' ';
      console.log(`  ${prefix} ${index + 1}. ${choice}`);
    });
    
    const answer = await ask(`\n选择 (1-${choices.length}): `);
    const index = parseInt(answer) - 1;
    
    if (index >= 0 && index < choices.length) {
      resolve(choices[index]);
    } else {
      resolve(choices[defaultIndex]);
    }
  });
}

// 环境检查
function checkEnvironment() {
  logStep(1, '检查环境');
  
  const checks = [];
  
  // Node.js 版本
  try {
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (major >= 20) {
      checks.push({ name: 'Node.js', status: 'ok', detail: nodeVersion });
    } else {
      checks.push({ name: 'Node.js', status: 'error', detail: `${nodeVersion} (需要 >= 20)` });
    }
  } catch (e) {
    checks.push({ name: 'Node.js', status: 'error', detail: '未找到' });
  }
  
  // npm 版本
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const major = parseInt(npmVersion.split('.')[0]);
    if (major >= 9) {
      checks.push({ name: 'npm', status: 'ok', detail: npmVersion });
    } else {
      checks.push({ name: 'npm', status: 'error', detail: `${npmVersion} (需要 >= 9)` });
    }
  } catch (e) {
    checks.push({ name: 'npm', status: 'error', detail: '未找到' });
  }
  
  // Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    checks.push({ name: 'Git', status: 'ok', detail: gitVersion });
  } catch (e) {
    checks.push({ name: 'Git', status: 'warning', detail: '未找到 (可选)' });
  }
  
  // OpenSkills
  try {
    const version = execSync('openskills --version', { encoding: 'utf8' }).trim();
    checks.push({ name: 'OpenSkills', status: 'ok', detail: version });
  } catch (e) {
    checks.push({ name: 'OpenSkills', status: 'warning', detail: '未安装 (可选)' });
  }
  
  // 项目检查
  if (existsSync(join(ROOT, 'package.json'))) {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    checks.push({ name: '项目配置', status: 'ok', detail: pkg.name });
  } else {
    checks.push({ name: '项目配置', status: 'error', detail: 'package.json 未找到' });
  }
  
  // 输出结果
  let allOk = true;
  checks.forEach(check => {
    const icon = check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    log(`  ${icon} ${check.name}: ${check.detail}`);
    if (check.status === 'error') allOk = false;
  });
  
  return allOk;
}

// 备份检查
async function checkBackup() {
  logStep(2, '备份检查');
  
  const hasGit = existsSync(join(ROOT, '.git'));
  
  if (hasGit) {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    
    if (status) {
      logWarning('检测到未提交的更改');
      const doCommit = await askYesNo('是否先提交当前更改？');
      
      if (doCommit) {
        const message = await ask('提交信息: ');
        execSync('git add .', { cwd: ROOT });
        execSync(`git commit -m "${message || 'pre-refactor backup'}"`, { cwd: ROOT });
        logSuccess('已提交更改');
      }
    }
    
    // 创建备份标签
    const tagName = `backup-${new Date().toISOString().slice(0, 10)}`;
    try {
      execSync(`git tag ${tagName}`, { cwd: ROOT });
      logSuccess(`已创建备份标签: ${tagName}`);
    } catch (e) {
      logWarning('备份标签创建失败，继续执行...');
    }
  } else {
    logWarning('未检测到 Git 仓库，跳过备份');
    const continueAnyway = await askYesNo('是否继续执行？');
    if (!continueAnyway) {
      process.exit(0);
    }
  }
}

// 选择执行模式
async function selectMode() {
  logStep(3, '选择执行模式');
  
  const mode = await askChoice(
    '您希望如何执行重构？',
    [
      '完整自动化 (推荐新手)',
      '分阶段执行 (推荐谨慎)',
      '单个任务 (专家模式)',
      '仅生成计划 (预览)'
    ]
  );
  
  return mode;
}

// 选择阶段
async function selectPhase() {
  const phases = [
    'build-tools',
    'react18',
    'g2-5x',
    'hooks',
    'ai-system',
    'testing',
    'docs'
  ];
  
  const phaseNames = {
    'build-tools': '构建工具迁移 (Vite)',
    'react18': 'React 18 升级',
    'g2-5x': 'G2 5.x 升级',
    'hooks': 'Hooks 迁移',
    'ai-system': 'AI 体系建立',
    'testing': '测试与验证',
    'docs': '文档生成'
  };
  
  const selected = await askChoice(
    '选择要执行的阶段',
    phases.map(p => phaseNames[p])
  );
  
  return phases.find(p => phaseNames[p] === selected);
}

// 选择任务
async function selectTask() {
  const tasks = [
    'add-component',
    'fix-bug',
    'performance-optimize',
    'generate-docs',
    'run-tests',
    'code-review'
  ];
  
  const taskNames = {
    'add-component': '添加新组件',
    'fix-bug': '修复 Bug',
    'performance-optimize': '性能优化',
    'generate-docs': '生成文档',
    'run-tests': '运行测试',
    'code-review': '代码审查'
  };
  
  const selected = await askChoice(
    '选择要执行的任务',
    tasks.map(t => taskNames[t])
  );
  
  return tasks.find(t => taskNames[t] === selected);
}

// 执行命令
function executeCommand(command, description) {
  log(`\n执行: ${description}`);
  log(`命令: ${command}`);
  
  try {
    execSync(command, { 
      cwd: ROOT,
      stdio: 'inherit',
      encoding: 'utf8'
    });
    logSuccess(`${description} 完成`);
    return true;
  } catch (error) {
    logError(`${description} 失败`);
    console.error(error.message);
    return false;
  }
}

// 完整自动化流程
async function runFullAutomation() {
  logStep(4, '开始完整自动化重构');
  
  const steps = [
    {
      name: '安装依赖',
      command: 'npm install',
      description: '安装项目依赖'
    },
    {
      name: '执行构建迁移',
      command: 'node AI-SKILLS/scripts/migrate-build.js',
      description: '迁移构建工具到 Vite'
    },
    {
      name: '测试构建',
      command: 'npm run build',
      description: '验证构建是否成功'
    },
    {
      name: '运行测试',
      command: 'npm test',
      description: '验证功能完整性'
    }
  ];
  
  for (const step of steps) {
    log(`\n${colors.bold}步骤: ${step.name}${colors.reset}`);
    
    const proceed = await askYesNo(`执行 ${step.description}?`, true);
    
    if (proceed) {
      const success = executeCommand(step.command, step.description);
      
      if (!success) {
        const retry = await askYesNo('是否重试？');
        if (retry) {
          // 重新执行当前步骤
          const success2 = executeCommand(step.command, step.description);
          if (!success2) {
            logError('步骤失败，停止执行');
            break;
          }
        } else {
          break;
        }
      }
    } else {
      logWarning('跳过此步骤');
    }
  }
  
  // 生成报告
  logStep(5, '生成重构报告');
  executeCommand(
    'node AI-SKILLS/scripts/generate-report.js',
    '生成完整报告'
  );
}

// 分阶段执行
async function runPhased() {
  const phase = await selectPhase();
  
  logStep(4, `执行阶段: ${phase}`);
  
  const commands = {
    'build-tools': 'node AI-SKILLS/scripts/migrate-build.js',
    'react18': 'npm install react@^18.2.0 react-dom@^18.2.0',
    'g2-5x': 'node AI-SKILLS/scripts/migrate-g2.js',
    'hooks': 'echo "Hooks 迁移需要手动检查"',
    'ai-system': 'openskills install ./AI-SKILLS',
    'testing': 'npm test',
    'docs': 'npm run docs'
  };
  
  const command = commands[phase];
  
  if (command) {
    executeCommand(command, `阶段 ${phase}`);
  } else {
    logWarning(`阶段 ${phase} 需要手动执行`);
  }
}

// 单个任务执行
async function runTask() {
  const task = await selectTask();
  
  logStep(4, `执行任务: ${task}`);
  
  const commands = {
    'add-component': 'openskills run cloud-charts-dev --task="add-component"',
    'fix-bug': 'openskills run cloud-charts-dev --task="fix-bug"',
    'performance-optimize': 'openskills run cloud-charts-testing --task="performance-test"',
    'generate-docs': 'openskills run cloud-charts-docs --task="generate-api-docs"',
    'run-tests': 'npm test',
    'code-review': 'openskills run cloud-charts-dev --task="code-review"'
  };
  
  const command = commands[task];
  
  if (command) {
    executeCommand(command, `任务 ${task}`);
  } else {
    logWarning(`任务 ${task} 需要手动执行`);
  }
}

// 仅生成计划
async function generatePlan() {
  logStep(4, '生成重构计划');
  
  log('\n📄 正在生成以下文档:');
  log('  - AI-知识库文档.md');
  log('  - 重构计划书.md');
  log('  - 实施指南.md');
  log('  - 快速参考卡.md');
  
  const proceed = await askYesNo('继续生成？', true);
  
  if (proceed) {
    logSuccess('这些文档已经存在于 AI-SKILLS 目录中！');
    log('\n您可以查看:');
    log('  - AI-SKILLS/README.md - 技能说明');
    log('  - AI-SKILLS/使用指南.md - 详细使用指南');
    log('  - AI-SKILLS/SKILL.md - 技能定义');
  }
}

// 主函数
async function main() {
  console.clear();
  
  log(`${colors.bold}🚀 CloudCharts AI 重构启动器${colors.reset}`, 'cyan');
  log('=' .repeat(60), 'cyan');
  
  // 1. 环境检查
  const envOk = checkEnvironment();
  if (!envOk) {
    logError('环境检查失败，请修复上述问题后重试');
    process.exit(1);
  }
  
  // 2. 备份检查
  await checkBackup();
  
  // 3. 选择模式
  const mode = await selectMode();
  
  // 4. 执行
  if (mode.includes('完整自动化')) {
    await runFullAutomation();
  } else if (mode.includes('分阶段')) {
    await runPhased();
  } else if (mode.includes('单个任务')) {
    await runTask();
  } else {
    await generatePlan();
  }
  
  // 5. 完成
  logStep('完成', '重构流程执行完毕！');
  log('\n📊 下一步建议:');
  log('  1. 查看生成的报告');
  log('  2. 运行测试验证');
  log('  3. 检查代码变更');
  log('  4. 提交到 Git');
  
  const viewReport = await askYesNo('是否查看报告？', false);
  if (viewReport) {
    try {
      execSync('cat reports/REFACTOR-REPORT.md 2>/dev/null || cat REFACTOR-REPORT.md', {
        cwd: ROOT,
        stdio: 'inherit'
      });
    } catch (e) {
      logWarning('报告文件未找到');
    }
  }
  
  rl.close();
  log('\n🎉 感谢使用 CloudCharts AI 重构工具！', 'green');
}

// 错误处理
process.on('uncaughtException', (error) => {
  logError(`发生错误: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});

process.on('SIGINT', () => {
  logWarning('\n用户中断执行');
  rl.close();
  process.exit(0);
});

// 启动
main();

