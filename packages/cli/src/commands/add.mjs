import path from 'node:path';
import { log, c, fail } from '../utils/log.mjs';
import { confirm, multiSelect } from '../utils/prompt.mjs';
import { readConfig, DEFAULT_CONFIG, CONFIG_FILE } from '../utils/config.mjs';
import { resolveFramework } from '../utils/args.mjs';
import { resolveSourceRoot, isDir, walk, readText, writeText, exists } from '../utils/fsutil.mjs';
import { rewriteImports, isCodeFile } from '../utils/transform.mjs';
import { addDependencies } from '../utils/pkg.mjs';
import {
  REGISTRY,
  findComponent,
  componentsForFramework,
  REACT_SHARED_DIRS,
  SOLID_SHARED_DIRS,
  SOLID_SHARED_FILES,
  CORE_SHARED_DIRS,
  FRAMEWORKS,
  PLANNED_FRAMEWORKS,
  CORE_PKG,
  REACT_PKG,
  LEGACY_PKG,
  G2_DEP,
  G2_VERSION,
} from '../registry.mjs';

/**
 * cloud-charts add [components...] — 安装组件（源码复制 或 npm 依赖）。
 *
 * Flags:
 *   -t/--framework, --react/--solid/--vanilla
 *   --all          安装该框架下全部组件
 *   -o/--outDir    覆盖组件安装目录
 *   --as-dep       仅添加 npm 依赖，不复制源码
 *   --overwrite    覆盖已存在文件
 *   --dry-run      只打印将执行的操作
 *   --source next|legacy
 */
export async function addCommand({ positionals, flags }) {
  const cwd = process.cwd();
  const config = readConfig(cwd) || { ...DEFAULT_CONFIG, _implicit: true };
  const dryRun = Boolean(flags['dry-run']);

  // 1) 框架解析
  let framework = resolveFramework(flags) || config.framework;
  if (PLANNED_FRAMEWORKS.includes(framework)) {
    fail(`框架 "${framework}" 尚未实现（计划中）。当前支持: ${FRAMEWORKS.join(', ')}`);
  }
  if (!FRAMEWORKS.includes(framework)) {
    fail(`未知框架 "${framework}"。支持: ${FRAMEWORKS.join(', ')}`);
  }

  // 2) 安装方式
  const mode = flags['as-dep'] ? 'dep' : config.mode || 'copy';
  const source = flags.source ? String(flags.source) : config.source || 'next';

  // 3) 目标组件解析
  let targets = [];
  if (flags.all) {
    targets = componentsForFramework(framework);
  } else if (positionals.length) {
    for (const name of positionals) {
      const comp = findComponent(name);
      if (!comp) {
        fail(`未知组件 "${name}"。运行 ${c.cyan('cloud-charts list')} 查看全部。`);
      }
      if (!comp.frameworks.includes(framework)) {
        log.warn(`组件 ${c.cyan(comp.id)} 在 ${framework} 下不可用，已跳过。`);
        continue;
      }
      targets.push(comp);
    }
  } else if (process.stdin.isTTY) {
    const choices = componentsForFramework(framework).map((comp) => ({
      label: `${comp.id}${comp.type === 'ui' ? c.gray(' (ui)') : ''}`,
      value: comp.id,
    }));
    const picked = await multiSelect(`选择要安装的组件 (${framework})`, choices);
    targets = picked.map((id) => findComponent(id)).filter(Boolean);
  }

  if (!targets.length) {
    fail(`未指定组件。示例: ${c.cyan('cloud-charts add wbar --' + framework)} 或 --all`);
  }

  log.info(
    `框架 ${c.cyan(framework)} · 方式 ${c.cyan(mode === 'dep' ? 'npm依赖' : '源码复制')} · 来源 ${c.cyan(source)}${dryRun ? c.yellow(' · dry-run') : ''}`,
  );
  log.step(`组件: ${targets.map((t) => t.id).join(', ')}`);

  if (mode === 'dep') {
    return addAsDependency({ cwd, framework, source, targets, dryRun });
  }
  return copySource({ cwd, config, framework, source, targets, dryRun, overwrite: Boolean(flags.overwrite), outDir: flags.outDir });
}

/** 依赖安装：只往 package.json 追加对应包 */
function addAsDependency({ cwd, framework, source, targets, dryRun }) {
  const deps = new Set();

  if (source === 'legacy') {
    deps.add(`${LEGACY_PKG}@latest`);
  } else if (framework === 'react') {
    deps.add(`${REACT_PKG}@latest`);
    deps.add(`${CORE_PKG}@latest`);
  } else if (framework === 'vanilla') {
    deps.add(`${CORE_PKG}@latest`);
    for (const t of targets) {
      if (t.source.vanilla?.pkg) deps.add(`${t.source.vanilla.pkg}@latest`);
    }
  } else if (framework === 'solid') {
    deps.add(`@alicloud/cloud-charts-solid@latest`);
    deps.add(`${CORE_PKG}@latest`);
  }

  const added = addDependencies(cwd, [...deps], { dryRun });
  if (!added.length) {
    log.ok('依赖均已存在，无需改动。');
  } else {
    added.forEach((d) => log.step(`+ ${d}`));
    log.ok(`${dryRun ? '(dry-run) 将写入' : '已写入'} package.json`);
  }
  log.info(`接下来运行 ${c.cyan('npm install')} 安装依赖。`);
  printUsageHint(framework, targets, source, 'dep');
}

/** 源码复制：把组件目录 + 共享运行时 + core model 复制到用户项目，并改写 import */
function copySource({ cwd, config, framework, source, targets, dryRun, overwrite, outDir }) {
  const root = resolveSourceRoot();
  if (!root) {
    fail(
      `无法定位组件源码仓库。请在 monorepo 内运行，或设置环境变量 ${c.cyan('O_INSIGHT_SOURCE=<repo根目录>')}。`,
    );
  }
  if (source === 'legacy') {
    return copyLegacySource({ cwd, config, root, targets, dryRun, overwrite, outDir });
  }
  if (framework === 'vanilla') {
    return copyVanillaSource({ cwd, config, root, targets, dryRun, overwrite, outDir });
  }
  return copyFrameworkSource({ cwd, config, root, framework, targets, dryRun, overwrite, outDir });
}

/** react / solid：目录结构保留复制 charts/<x> + 共享 hooks/provider/... + core model + core 运行时 */
function copyFrameworkSource({ cwd, config, root, framework, targets, dryRun, overwrite, outDir }) {
  const compBase = path.resolve(cwd, outDir || config.paths.components);
  const coreBase = path.resolve(cwd, config.paths.core);
  const coreAlias = config.aliases.core;
  const fwSrcRoot = path.join(root, 'packages/frameworks', framework, 'src');

  const jobs = [];

  // 组件目录（保留 charts/<x> 相对结构，使组件间相对 import 不断裂）
  for (const t of targets) {
    const spec = framework === 'solid' ? t.source.solid : t.source.react;
    if (!spec) {
      log.warn(`组件 ${c.cyan(t.id)} 无 ${framework} 源码，已跳过。`);
      continue;
    }
    for (const d of spec.dirs) {
      const abs = path.join(root, d);
      const rel = path.relative(fwSrcRoot, abs); // e.g. charts/bar
      jobs.push({ from: abs, to: path.join(compBase, rel), rewrite: true });
    }
  }

  // 框架共享运行时（组件之外的相对 import 依赖）
  const sharedDirs = framework === 'react' ? REACT_SHARED_DIRS : framework === 'solid' ? SOLID_SHARED_DIRS : [];
  for (const d of sharedDirs) {
    const abs = path.join(root, d);
    const rel = path.relative(fwSrcRoot, abs);
    jobs.push({ from: abs, to: path.join(compBase, rel), rewrite: true });
  }
  const sharedFiles = framework === 'solid' ? SOLID_SHARED_FILES : [];
  for (const f of sharedFiles) {
    const abs = path.join(root, f);
    const rel = path.relative(fwSrcRoot, abs);
    jobs.push({ from: abs, to: path.join(compBase, rel), rewrite: true, single: true });
  }

  // core：model 三件套（按需）+ 公共运行时目录
  const coreSrcRoot = path.join(root, 'packages/core/src');
  const modelDir = path.join(coreSrcRoot, 'model');
  for (const t of targets) {
    if (!t.coreModel) continue;
    for (const suffix of ['.ts', 'DefaultConfig.ts', 'Model.ts']) {
      const file = path.join(modelDir, `${t.coreModel}${suffix}`);
      if (exists(file)) {
        jobs.push({ from: file, to: path.join(coreBase, 'model', path.basename(file)), rewrite: true, single: true });
      }
    }
  }
  // model/index.ts + createChartModel.ts
  for (const f of ['index.ts', 'createChartModel.ts']) {
    const file = path.join(modelDir, f);
    if (exists(file)) jobs.push({ from: file, to: path.join(coreBase, 'model', f), rewrite: true, single: true });
  }
  for (const d of CORE_SHARED_DIRS) {
    const abs = path.join(root, d);
    const rel = path.relative(coreSrcRoot, abs);
    jobs.push({ from: abs, to: path.join(coreBase, rel), rewrite: true });
  }
  // core/index.ts 供别名根引用
  const coreIndex = path.join(coreSrcRoot, 'index.ts');
  if (exists(coreIndex)) jobs.push({ from: coreIndex, to: path.join(coreBase, 'index.ts'), rewrite: true, single: true });

  runCopyJobs(jobs, { coreAlias, dryRun, overwrite });

  // core 内部对自身 @alicloud/cloud-charts-core 的自引用也会被改写为别名——保持一致即可
  if (!dryRun) {
    addDependencies(cwd, [`${G2_DEP}@${G2_VERSION}`], {});
    log.step(`+ 依赖 ${G2_DEP}@${G2_VERSION}`);
  }
  log.ok(`${dryRun ? '(dry-run) ' : ''}源码复制完成`);
  log.info(`组件 → ${c.cyan(path.relative(cwd, compBase))}  ·  core → ${c.cyan(path.relative(cwd, coreBase))}`);
  log.plain(c.gray(`  提示: 请在 tsconfig/vite 中配置别名 ${config.aliases.core} 与 ${config.aliases.components}`));
  printUsageHint(framework, targets, 'next', 'copy', config);
}

/** vanilla：复制 packages/charts/<id>/src（+ 提示 core 作为依赖或复制） */
function copyVanillaSource({ cwd, config, root, targets, dryRun, overwrite, outDir }) {
  const compBase = path.resolve(cwd, outDir || config.paths.components);
  const jobs = [];
  for (const t of targets) {
    const spec = t.source.vanilla;
    if (!spec) {
      log.warn(`组件 ${c.cyan(t.id)} 无 vanilla 源码，已跳过。`);
      continue;
    }
    for (const d of spec.dirs) {
      jobs.push({ from: path.join(root, d), to: path.join(compBase, t.id), rewrite: true });
    }
  }
  runCopyJobs(jobs, { coreAlias: config.aliases.core, dryRun, overwrite });
  if (!dryRun) {
    addDependencies(cwd, [`${CORE_PKG}@latest`, `${G2_DEP}@${G2_VERSION}`], {});
  }
  log.ok(`${dryRun ? '(dry-run) ' : ''}vanilla 源码复制完成`);
  log.info(`已将 ${c.cyan(CORE_PKG)} 与 ${c.cyan(G2_DEP)} 加入依赖（vanilla 图表依赖 core 运行时）。`);
  printUsageHint('vanilla', targets, 'next', 'copy', config);
}

/** legacy：复制 packages/compat/src/<W*> 兼容层（转发到 @alicloud/cloud-charts-react） */
function copyLegacySource({ cwd, config, root, targets, dryRun, overwrite, outDir }) {
  const compBase = path.resolve(cwd, outDir || config.paths.components);
  const jobs = [];
  for (const t of targets) {
    const spec = t.source.legacy;
    if (!spec) {
      log.warn(`组件 ${c.cyan(t.id)} 无 legacy 兼容源码，已跳过。`);
      continue;
    }
    for (const d of spec.dirs) {
      jobs.push({ from: path.join(root, d), to: path.join(compBase, path.basename(d)), rewrite: false });
    }
  }
  runCopyJobs(jobs, { coreAlias: config.aliases.core, dryRun, overwrite });
  if (!dryRun) {
    addDependencies(cwd, [`${REACT_PKG}@latest`, `${CORE_PKG}@latest`, `${G2_DEP}@${G2_VERSION}`], {});
  }
  log.ok(`${dryRun ? '(dry-run) ' : ''}legacy 兼容层复制完成`);
  log.info(`兼容层转发到 ${c.cyan(REACT_PKG)}，已加入依赖。`);
  printUsageHint('react', targets, 'legacy', 'copy', config);
}

/** 执行复制任务：目录 -> walk 所有文件；single -> 单文件 */
function runCopyJobs(jobs, { coreAlias, dryRun, overwrite }) {
  let count = 0;
  let skipped = 0;
  for (const job of jobs) {
    const files = job.single ? [''] : walk(job.from);
    if (!job.single && !isDir(job.from)) {
      if (process.env.O_INSIGHT_DEBUG) log.step(`跳过空/缺失目录: ${job.from}`);
      continue;
    }
    for (const rel of files) {
      const src = job.single ? job.from : path.join(job.from, rel);
      const dest = job.single ? job.to : path.join(job.to, rel);
      if (exists(dest) && !overwrite) {
        skipped++;
        continue;
      }
      let content = readText(src);
      if (job.rewrite && isCodeFile(path.basename(src))) {
        content = rewriteImports(content, { coreAlias });
      }
      if (dryRun) {
        log.step(`${c.green('copy')} ${dest.split(path.sep).slice(-4).join('/')}`);
      } else {
        writeText(dest, content);
      }
      count++;
    }
  }
  if (!dryRun) log.step(`写入 ${count} 个文件${skipped ? c.gray(`，跳过 ${skipped} 个已存在（用 --overwrite 覆盖）`) : ''}`);
  else log.step(`${c.yellow('dry-run')} 将写入 ${count} 个文件，跳过 ${skipped} 个已存在`);
}

function printUsageHint(framework, targets, source, mode, config) {
  const first = targets.find((t) => t.type === 'chart') || targets[0];
  if (!first) return;
  log.title('用法示例');
  const importBase =
    mode === 'copy' && config
      ? config.aliases.components
      : source === 'legacy'
        ? LEGACY_PKG
        : framework === 'vanilla'
          ? first.source.vanilla?.pkg || CORE_PKG
          : framework === 'solid'
            ? '@alicloud/cloud-charts-solid'
            : REACT_PKG;
  if (framework === 'react') {
    const name = source === 'legacy' ? `W${first.id.slice(1)}` : first.reactExport;
    log.plain(c.dim(`  import { ${name} } from '${importBase}';`));
    log.plain(c.dim(`  <${name} data={data} config={{}} />`));
  } else if (framework === 'vanilla') {
    const fnBase = first.id.charAt(0).toUpperCase() + first.id.slice(1); // wbar -> Wbar
    log.plain(c.dim(`  import { render${fnBase}Model } from '${importBase}';`));
    log.plain(c.dim(`  render${fnBase}Model({ container, data });`));
  } else {
    log.plain(c.dim(`  import { ${first.reactExport} } from '${importBase}';`));
  }
  void REGISTRY;
  void CONFIG_FILE;
}
