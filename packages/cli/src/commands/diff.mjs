import path from 'node:path';
import { log, c, fail } from '../utils/log.mjs';
import { readConfig } from '../utils/config.mjs';
import { resolveFramework } from '../utils/args.mjs';
import { resolveSourceRoot, walk, readText, exists } from '../utils/fsutil.mjs';
import { rewriteImports, isCodeFile } from '../utils/transform.mjs';
import { findComponent, FRAMEWORKS } from '../registry.mjs';

/**
 * cloud-charts diff <component> — 比较本地已安装源码与仓库最新源码。
 * 仅做逐文件存在性/内容差异统计（不生成 patch），用于提示是否需要更新。
 */
export function diffCommand({ positionals, flags }) {
  const cwd = process.cwd();
  const config = readConfig(cwd);
  if (!config) fail(`未找到 cloud-charts.json，请先运行 ${c.cyan('cloud-charts init')}。`);

  const name = positionals[0];
  if (!name) fail(`用法: ${c.cyan('cloud-charts diff <component>')}`);
  const comp = findComponent(name);
  if (!comp) fail(`未知组件 "${name}"`);

  const framework = resolveFramework(flags) || config.framework;
  if (!FRAMEWORKS.includes(framework)) fail(`未知框架 "${framework}"`);

  const root = resolveSourceRoot();
  if (!root) fail('无法定位源码仓库，设置 O_INSIGHT_SOURCE 环境变量。');

  const spec = framework === 'solid' ? comp.source.solid : framework === 'vanilla' ? comp.source.vanilla : comp.source.react;
  if (!spec) fail(`组件 ${comp.id} 在 ${framework} 下无源码。`);

  const fwSrcRoot = path.join(root, 'packages/frameworks', framework, 'src');
  const compBase = path.resolve(cwd, config.paths.components);
  const coreAlias = config.aliases.core;

  let changed = 0;
  let missing = 0;
  let same = 0;

  for (const d of spec.dirs) {
    const abs = path.join(root, d);
    const rel = framework === 'vanilla' ? comp.id : path.relative(fwSrcRoot, abs);
    for (const f of walk(abs)) {
      const src = path.join(abs, f);
      const local = path.join(compBase, rel, f);
      let upstream = readText(src);
      if (isCodeFile(f)) upstream = rewriteImports(upstream, { coreAlias });
      if (!exists(local)) {
        log.step(`${c.yellow('缺失')} ${rel}/${f}`);
        missing++;
      } else if (readText(local) !== upstream) {
        log.step(`${c.cyan('差异')} ${rel}/${f}`);
        changed++;
      } else {
        same++;
      }
    }
  }

  log.plain('');
  log.info(`${comp.id} (${framework}): ${c.cyan(changed + ' 差异')}, ${c.yellow(missing + ' 缺失')}, ${c.green(same + ' 一致')}`);
  if (changed || missing) {
    log.info(`更新: ${c.cyan(`cloud-charts add ${comp.id} --${framework} --overwrite`)}`);
  }
}
