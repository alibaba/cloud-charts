import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 解析组件源码仓库根目录。
 * 优先级：O_INSIGHT_SOURCE 环境变量 > 从 CLI 包向上寻找带 workspaces 的 monorepo 根。
 *
 * 说明：正式发布时，源码应随 CLI 包一起发布，或改为从远端 registry 拉取；
 * 当前实现面向 monorepo 内使用（CLI 位于 packages/cli），向上定位到仓库根。
 */
export function resolveSourceRoot() {
  if (process.env.O_INSIGHT_SOURCE) {
    return path.resolve(process.env.O_INSIGHT_SOURCE);
  }
  // 发布包内随包携带的组件源码快照（build-vendor.mjs 生成）
  const vendor = path.resolve(__dirname, '..', '..', 'vendor');
  if (fs.existsSync(path.join(vendor, 'packages'))) {
    return vendor;
  }
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    const pkg = path.join(dir, 'package.json');
    if (fs.existsSync(pkg)) {
      try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        if (Array.isArray(json.workspaces) && fs.existsSync(path.join(dir, 'packages'))) {
          return dir;
        }
      } catch {
        // ignore
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * 解析 skills 目录根。
 * 优先级：O_INSIGHT_SKILLS_SOURCE 环境变量 > 随包携带的 vendor/skills 快照 >
 * 由 resolveSourceRoot 推导出的 <root>/skills（monorepo 仓库根或 vendor 根）。
 */
export function resolveSkillsRoot() {
  if (process.env.O_INSIGHT_SKILLS_SOURCE) {
    return path.resolve(process.env.O_INSIGHT_SKILLS_SOURCE);
  }
  const vendorSkills = path.resolve(__dirname, '..', '..', 'vendor', 'skills');
  if (fs.existsSync(vendorSkills)) {
    return vendorSkills;
  }
  // 向上寻找带 workspaces 标记且包含 skills/ 的 monorepo 根
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    const pkg = path.join(dir, 'package.json');
    const skills = path.join(dir, 'skills');
    if (fs.existsSync(pkg) && fs.existsSync(skills)) {
      try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        if (Array.isArray(json.workspaces)) return skills;
      } catch {
        // ignore
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** 递归复制目录，返回复制的文件数。 */
export function copyDir(from, to) {
  if (!isDir(from)) return 0;
  let n = 0;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      n += copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
      n++;
    }
  }
  return n;
}

export function exists(p) {
  return fs.existsSync(p);
}

export function isDir(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

/** 递归列出目录内所有文件（相对该目录） */
export function walk(dir) {
  const out = [];
  if (!isDir(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full).map((f) => path.join(entry.name, f)));
    } else {
      out.push(entry.name);
    }
  }
  return out;
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

export function writeText(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}
