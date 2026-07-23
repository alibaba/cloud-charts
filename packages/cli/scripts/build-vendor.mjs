#!/usr/bin/env node
/**
 * 构建脚本：把组件源码快照进 CLI 包，使发布后的 CLI 无需 monorepo 也能安装组件。
 *
 * 快照策略：复制各 workspace 的 src（及 vanilla 单图包的 src/package.json），
 * 保持相对路径 packages/... 结构，这样 resolveSourceRoot 指向 vendor 目录即可复用现有复制逻辑。
 *
 * 用法：node scripts/build-vendor.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '..', '..');
const vendorRoot = path.join(cliRoot, 'vendor');

/** 需要快照的源码目录（相对仓库根） */
const SRC_DIRS = [
  'packages/core/src',
  'packages/frameworks/react/src',
  'packages/frameworks/solid/src',
  'packages/compat/src',
];

/** 需要快照的额外单文件（vendor 定位需要 workspaces 标记） */
function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
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

function main() {
  // 清理旧快照
  fs.rmSync(vendorRoot, { recursive: true, force: true });
  fs.mkdirSync(vendorRoot, { recursive: true });

  let total = 0;

  // 1) 标准 src 目录
  for (const rel of SRC_DIRS) {
    const from = path.join(repoRoot, rel);
    const to = path.join(vendorRoot, rel);
    const n = copyDir(from, to);
    total += n;
    console.log(`  ${rel}  (${n} files)`);
  }

  // 2) vanilla 单图包：packages/charts/*/src
  const chartsRoot = path.join(repoRoot, 'packages/charts');
  if (fs.existsSync(chartsRoot)) {
    for (const dir of fs.readdirSync(chartsRoot, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      const rel = `packages/charts/${dir.name}/src`;
      const from = path.join(repoRoot, rel);
      const n = copyDir(from, path.join(vendorRoot, rel));
      total += n;
    }
    console.log(`  packages/charts/*/src  (${fs.readdirSync(chartsRoot).length} pkgs)`);
  }

  // 3) 写一个带 workspaces 标记的 package.json，供 resolveSourceRoot 识别 vendor 为源根
  fs.writeFileSync(
    path.join(vendorRoot, 'package.json'),
    JSON.stringify(
      {
        name: '@alicloud/cloud-charts-cli-vendor',
        private: true,
        workspaces: ['packages/*'],
        _note: 'Auto-generated source snapshot for cloud-charts CLI. Do not edit.',
      },
      null,
      2,
    ) + '\n',
  );
  fs.mkdirSync(path.join(vendorRoot, 'packages'), { recursive: true });

  // 4) 快照 AI 技能目录，供 `cloud-charts skills add` 在发布包内离线安装
  const skillsFrom = path.join(repoRoot, 'skills');
  if (fs.existsSync(skillsFrom)) {
    const skillsTo = path.join(vendorRoot, 'skills');
    const n = copyDir(skillsFrom, skillsTo);
    total += n;
    console.log(`  skills  (${n} files)`);
  }

  console.log(`\nvendor 快照完成：${total} 个文件 → ${path.relative(repoRoot, vendorRoot)}`);
}

main();
