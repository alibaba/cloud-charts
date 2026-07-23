import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { log, c } from '../utils/log.mjs';
import { resolveSkillsRoot, copyDir, isDir, exists } from '../utils/fsutil.mjs';

const DEFAULT_DIR = path.join(os.homedir(), '.qoder', 'skills');

/** 列出 skills 根目录下的可安装 skill（含 SKILL.md 的目录）。 */
function discoverSkills(root) {
  if (!isDir(root)) return [];
  const out = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(root, entry.name, 'SKILL.md');
    if (!exists(skillFile)) continue;
    out.push({ id: entry.name, dir: path.join(root, entry.name), summary: readSummary(skillFile) });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** 从 SKILL.md frontmatter 提取一句话描述（description 优先，否则第一段正文）。 */
function readSummary(skillFile) {
  let text;
  try {
    text = fs.readFileSync(skillFile, 'utf8');
  } catch {
    return '';
  }
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (fm) {
    const desc = fm[1].match(/^description:\s*(.+)$/m);
    if (desc) {
      let s = desc[1].trim().replace(/^["']|["']$/g, '');
      const stop = s.search(/[。.]\s|\.$|。$/);
      if (stop > 0) s = s.slice(0, stop + 1);
      return s.length > 140 ? s.slice(0, 137) + '…' : s;
    }
  }
  return '';
}

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name));
    else n++;
  }
  return n;
}

export function skillsCommand({ positionals, flags }) {
  const root = resolveSkillsRoot();
  if (!root) {
    log.error('未找到 skills 源目录。请在 monorepo 内运行，或设置 O_INSIGHT_SKILLS_SOURCE 指向包含 skills/ 的目录。');
    process.exit(1);
  }

  const sub = positionals.shift() || 'list';
  const available = discoverSkills(root);

  if (sub === 'list' || sub === 'ls') {
    log.title('可安装的 Skills');
    if (!available.length) {
      log.plain(c.gray('  (无)'));
      return;
    }
    for (const s of available) {
      log.plain(`  ${c.bold(s.id)}`);
      if (s.summary) log.plain(`    ${c.gray(s.summary)}`);
    }
    log.plain('');
    log.plain(c.gray(`安装：cloud-charts skills add <name...>  (默认目录 ${DEFAULT_DIR})`));
    return;
  }

  if (sub !== 'add') {
    log.error(`未知子命令 "skills ${sub}"。可用：list | add`);
    process.exit(1);
  }

  // skills add
  const targetDir = flags.dir ? path.resolve(String(flags.dir)) : DEFAULT_DIR;
  const dryRun = !!flags['dry-run'];
  const overwrite = !!flags.overwrite;

  let selected;
  if (flags.all) {
    selected = available;
  } else {
    if (!positionals.length) {
      log.error('请指定要安装的 skill 名称，或使用 --all。可用列表：cloud-charts skills list');
      process.exit(1);
    }
    selected = [];
    for (const name of positionals) {
      const found = available.find((s) => s.id === name);
      if (!found) {
        log.error(`未找到 skill "${name}"。可用：${available.map((s) => s.id).join(', ')}`);
        process.exit(1);
      }
      selected.push(found);
    }
  }

  log.title(`安装 ${selected.length} 个 skill → ${targetDir}${dryRun ? c.yellow('  (dry-run)') : ''}`);

  let installed = 0;
  for (const s of selected) {
    const dest = path.join(targetDir, s.id);
    const fileCount = countFiles(s.dir);
    if (exists(dest) && !overwrite) {
      log.warn(`${s.id} 已存在，跳过（--overwrite 覆盖）：${dest}`);
      continue;
    }
    if (dryRun) {
      log.step(`${c.bold(s.id)}  ${c.gray(`${fileCount} files → ${dest}`)}`);
      continue;
    }
    if (exists(dest) && overwrite) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    const n = copyDir(s.dir, dest);
    log.step(`${c.bold(s.id)}  ${c.gray(`${n} files → ${dest}`)}`);
    installed++;
  }

  if (dryRun) {
    log.plain('');
    log.info('dry-run 结束，未写入文件。');
    return;
  }
  log.plain('');
  log.ok(`已安装 ${installed} 个 skill 到 ${targetDir}`);
  log.plain(c.gray('重启 / 重新加载你的 agent（Qoder CLI 等）即可识别新 skill。'));
}
