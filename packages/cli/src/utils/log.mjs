// 零依赖终端着色 + 日志。无 TTY 时自动降级为纯文本。
const useColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;
const wrap = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s));

export const c = {
  bold: wrap('1'),
  dim: wrap('2'),
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  blue: wrap('34'),
  cyan: wrap('36'),
  gray: wrap('90'),
};

export const log = {
  info: (m) => console.log(`${c.cyan('info')}  ${m}`),
  ok: (m) => console.log(`${c.green('done')}  ${m}`),
  warn: (m) => console.log(`${c.yellow('warn')}  ${m}`),
  error: (m) => console.error(`${c.red('error')} ${m}`),
  step: (m) => console.log(`${c.dim('  ·')} ${m}`),
  plain: (m = '') => console.log(m),
  title: (m) => console.log(`\n${c.bold(m)}`),
};

export function fail(message) {
  log.error(message);
  process.exit(1);
}
