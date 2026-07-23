import fs from 'node:fs';
import path from 'node:path';

/**
 * 向用户项目 package.json 追加依赖（不覆盖已存在的版本）。
 * @returns {string[]} 实际新增的依赖列表（"pkg@ver"）
 */
export function addDependencies(cwd, deps, { dryRun = false } = {}) {
  const p = path.join(cwd, 'package.json');
  if (!fs.existsSync(p)) {
    throw new Error('当前目录未找到 package.json，请在项目根目录运行。');
  }
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  json.dependencies = json.dependencies || {};
  const added = [];
  for (const spec of deps) {
    const at = spec.lastIndexOf('@');
    const hasVer = at > 0;
    const name = hasVer ? spec.slice(0, at) : spec;
    const version = hasVer ? spec.slice(at + 1) : 'latest';
    if (!json.dependencies[name]) {
      json.dependencies[name] = version;
      added.push(`${name}@${version}`);
    }
  }
  if (!dryRun && added.length) {
    fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n', 'utf8');
  }
  return added;
}
