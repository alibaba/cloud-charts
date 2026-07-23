/**
 * 极简 argv 解析：分离位置参数与 --flag / --flag=value / -x。
 * 已知布尔 flag 不吞掉后续值。
 */
const BOOL_FLAGS = new Set([
  'all',
  'as-dep',
  'overwrite',
  'dry-run',
  'help',
  'version',
  'react',
  'solid',
  'vanilla',
  'yes',
  'legacy',
]);

const ALIASES = {
  t: 'framework',
  o: 'outDir',
  h: 'help',
  v: 'version',
  y: 'yes',
  f: 'framework',
};

export function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const body = arg.slice(2);
      const eq = body.indexOf('=');
      if (eq >= 0) {
        flags[body.slice(0, eq)] = body.slice(eq + 1);
      } else if (BOOL_FLAGS.has(body)) {
        flags[body] = true;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) {
          flags[body] = next;
          i++;
        } else {
          flags[body] = true;
        }
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      const key = ALIASES[arg.slice(1)] || arg.slice(1);
      if (BOOL_FLAGS.has(key)) {
        flags[key] = true;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = true;
        }
      }
    } else {
      positionals.push(arg);
    }
  }
  return { positionals, flags };
}

/** 从 flags 里解析出 framework：--react/--solid/--vanilla 简写或 -t/--framework */
export function resolveFramework(flags) {
  if (flags.react) return 'react';
  if (flags.solid) return 'solid';
  if (flags.vanilla) return 'vanilla';
  if (flags.framework) return String(flags.framework);
  return null;
}
