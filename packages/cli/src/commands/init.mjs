import fs from 'node:fs';
import { log, c, fail } from '../utils/log.mjs';
import { select, ask, confirm } from '../utils/prompt.mjs';
import {
  DEFAULT_CONFIG,
  readConfig,
  writeConfig,
  configPath,
  CONFIG_FILE,
} from '../utils/config.mjs';
import { resolveFramework } from '../utils/args.mjs';
import { FRAMEWORKS, PLANNED_FRAMEWORKS } from '../registry.mjs';

/**
 * cloud-charts init — 在当前项目生成 cloud-charts.json 配置。
 *
 * Flags:
 *   -t, --framework <react|solid|vanilla>
 *   --source <next|legacy>
 *   --mode <copy|dep>
 *   -y, --yes         使用默认值，不交互
 *   --overwrite       覆盖已存在的 cloud-charts.json
 */
export async function initCommand({ flags }) {
  const cwd = process.cwd();
  const existing = readConfig(cwd);
  if (existing && !flags.overwrite) {
    log.warn(`${CONFIG_FILE} 已存在。使用 ${c.cyan('--overwrite')} 覆盖，或直接运行 ${c.cyan('cloud-charts add')}。`);
    return;
  }

  let framework = resolveFramework(flags);
  if (framework && PLANNED_FRAMEWORKS.includes(framework)) {
    fail(`框架 "${framework}" 尚未实现（计划中）。当前支持: ${FRAMEWORKS.join(', ')}`);
  }

  const nonInteractive = flags.yes || !process.stdin.isTTY;

  if (!framework) {
    if (nonInteractive) {
      framework = DEFAULT_CONFIG.framework;
    } else {
      framework = await select(
        '选择目标框架',
        [
          { label: 'React（新架构，推荐）', value: 'react' },
          { label: 'Solid（alpha，仅 bar/line/pie）', value: 'solid' },
          { label: 'Vanilla / Angular / Vue（单图包）', value: 'vanilla' },
        ],
        0,
      );
    }
  }

  const source = flags.source
    ? String(flags.source)
    : nonInteractive
      ? DEFAULT_CONFIG.source
      : await select(
          '源码来源',
          [
            { label: '新架构 @alicloud/cloud-charts-*（G2 5，推荐）', value: 'next' },
            { label: '旧版兼容层 @alicloud/cloud-charts', value: 'legacy' },
          ],
          0,
        );

  const mode = flags.mode
    ? String(flags.mode)
    : nonInteractive
      ? DEFAULT_CONFIG.mode
      : await select(
          '默认安装方式',
          [
            { label: '源码复制（shadcn 式，可改可控）', value: 'copy' },
            { label: 'npm 依赖（仅安装包）', value: 'dep' },
          ],
          0,
        );

  const componentsDir = nonInteractive
    ? DEFAULT_CONFIG.paths.components
    : await ask('组件安装目录', DEFAULT_CONFIG.paths.components);

  const coreDir = nonInteractive
    ? DEFAULT_CONFIG.paths.core
    : await ask('core 运行时目录', DEFAULT_CONFIG.paths.core);

  const config = {
    ...DEFAULT_CONFIG,
    framework,
    source,
    mode,
    paths: { components: componentsDir, core: coreDir },
    aliases: {
      components: DEFAULT_CONFIG.aliases.components,
      core: DEFAULT_CONFIG.aliases.core,
    },
  };

  if (!nonInteractive) {
    log.title('即将写入 cloud-charts.json');
    log.plain(c.dim(JSON.stringify(config, null, 2)));
    const go = await confirm('确认写入?', true);
    if (!go) {
      log.warn('已取消。');
      return;
    }
  }

  writeConfig(config, cwd);
  log.ok(`已生成 ${c.cyan(CONFIG_FILE)} (${configPath(cwd)})`);
  log.plain('');
  log.info(`下一步: ${c.cyan('cloud-charts add wbar')} 或 ${c.cyan('cloud-charts list')}`);
  void fs;
}
