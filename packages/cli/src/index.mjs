import { log, c } from './utils/log.mjs';
import { parseArgs } from './utils/args.mjs';
import { initCommand } from './commands/init.mjs';
import { addCommand } from './commands/add.mjs';
import { listCommand } from './commands/list.mjs';
import { diffCommand } from './commands/diff.mjs';
import { skillsCommand } from './commands/skills.mjs';

const VERSION = '1.0.0-alpha.1';

const HELP = `
${c.bold('cloud-charts')} ${c.gray('· cloud-charts 图表组件安装器 (shadcn 风格)')}

${c.bold('用法')}
  cloud-charts <command> [options]

${c.bold('命令')}
  init                  初始化项目，生成 cloud-charts.json
  add [components...]    安装组件（源码复制 或 npm 依赖）
  list                  列出可安装组件及框架支持情况
  diff <component>       比较本地与最新源码
  skills <sub>          管理 AI 技能：list | add [names...]

${c.bold('通用选项')}
  -t, --framework <fw>  目标框架: react | solid | vanilla
      --react/--solid/--vanilla   框架简写
      --source <s>      源码来源: next(新架构) | legacy(兼容层)
  -h, --help            显示帮助
  -v, --version         显示版本

${c.bold('add 选项')}
  --all                 安装该框架下全部组件
  -o, --outDir <path>   覆盖组件安装目录
  --as-dep              仅添加 npm 依赖，不复制源码
  --overwrite           覆盖已存在文件
  --dry-run             预演，不写文件

${c.bold('skills 选项')}
  --all                 安装全部技能
  --dir <path>          安装目录（默认 ~/.qoder/skills）
  --overwrite           覆盖已存在技能
  --dry-run             预演，不写文件

${c.bold('示例')} ${c.gray('(发布名 @alicloud/cloud-charts-cli；全局安装后可用短命令 cloud-charts / oi)')}
  npx @alicloud/cloud-charts-cli@alpha init -t react
  npx @alicloud/cloud-charts-cli@alpha add wbar --react
  npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie
  npx @alicloud/cloud-charts-cli@alpha add --all --solid
  npx @alicloud/cloud-charts-cli@alpha add wbar --react --as-dep
  npx @alicloud/cloud-charts-cli@alpha add wbar -o src/widgets --dry-run
  npx @alicloud/cloud-charts-cli@alpha list --vanilla
  npx @alicloud/cloud-charts-cli@alpha skills list
  npx @alicloud/cloud-charts-cli@alpha skills add cloud-charts-chart
  npx @alicloud/cloud-charts-cli@alpha skills add --all --dir ~/.qoder/skills
`;

export async function run(argv) {
  const { positionals, flags } = parseArgs(argv);
  const command = positionals.shift();

  if (flags.version || command === 'version') {
    log.plain(VERSION);
    return;
  }
  if (!command || flags.help || command === 'help') {
    log.plain(HELP);
    return;
  }

  try {
    switch (command) {
      case 'init':
        await initCommand({ positionals, flags });
        break;
      case 'add':
        await addCommand({ positionals, flags });
        break;
      case 'list':
      case 'ls':
        listCommand({ positionals, flags });
        break;
      case 'diff':
        diffCommand({ positionals, flags });
        break;
      case 'skills':
        skillsCommand({ positionals, flags });
        break;
      default:
        log.error(`未知命令 "${command}"`);
        log.plain(HELP);
        process.exit(1);
    }
  } catch (err) {
    log.error(err.message || String(err));
    if (process.env.O_INSIGHT_DEBUG) console.error(err);
    process.exit(1);
  }
}
