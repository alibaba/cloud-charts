import { log, c } from '../utils/log.mjs';
import { REGISTRY, FRAMEWORKS, PLANNED_FRAMEWORKS } from '../registry.mjs';
import { resolveFramework } from '../utils/args.mjs';

/**
 * cloud-charts list — 列出可安装组件及其支持的框架。
 * Flags: -t/--framework 只显示某框架下可用的组件。
 */
export function listCommand({ flags }) {
  const filter = resolveFramework(flags);

  const charts = REGISTRY.filter((c2) => c2.type === 'chart');
  const uis = REGISTRY.filter((c2) => c2.type === 'ui');

  const mark = (comp, fw) => (comp.frameworks.includes(fw) ? c.green('●') : c.gray('·'));

  const render = (list, heading) => {
    log.title(heading);
    if (filter) {
      const avail = list.filter((comp) => comp.frameworks.includes(filter));
      log.plain(avail.map((comp) => c.cyan(comp.id)).join('  ') || c.gray('（无）'));
      return;
    }
    log.plain(c.dim('  id             react solid vanilla'));
    for (const comp of list) {
      const id = comp.id.padEnd(14);
      log.plain(
        `  ${id} ${mark(comp, 'react')}     ${mark(comp, 'solid')}     ${mark(comp, 'vanilla')}`,
      );
    }
  };

  render(charts, `图表组件 (${charts.length})`);
  render(uis, `UI 组件 (${uis.length})`);

  log.plain('');
  log.info(`支持框架: ${FRAMEWORKS.map((f) => c.cyan(f)).join(', ')}`);
  log.plain(c.gray(`  计划中(未实现): ${PLANNED_FRAMEWORKS.join(', ')}`));
  log.plain('');
  log.info(`安装示例: ${c.cyan('cloud-charts add wbar --react')}`);
}
