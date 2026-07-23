// 极简交互式提示（零依赖，基于 readline）。非 TTY 环境返回默认值。
import readline from 'node:readline';

function createRl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

export async function ask(question, defaultValue = '') {
  if (!process.stdin.isTTY) return defaultValue;
  const rl = createRl();
  const hint = defaultValue ? ` (${defaultValue})` : '';
  const answer = await new Promise((resolve) => {
    rl.question(`? ${question}${hint} `, (a) => resolve(a.trim()));
  });
  rl.close();
  return answer || defaultValue;
}

export async function confirm(question, defaultYes = true) {
  if (!process.stdin.isTTY) return defaultYes;
  const suffix = defaultYes ? '[Y/n]' : '[y/N]';
  const a = (await ask(`${question} ${suffix}`)).toLowerCase();
  if (!a) return defaultYes;
  return a === 'y' || a === 'yes';
}

/** 单选：返回被选中项的值 */
export async function select(question, choices, defaultIndex = 0) {
  if (!process.stdin.isTTY) return choices[defaultIndex].value;
  console.log(`? ${question}`);
  choices.forEach((ch, i) => {
    const mark = i === defaultIndex ? '>' : ' ';
    console.log(`  ${mark} ${i + 1}) ${ch.label}`);
  });
  const raw = await ask(`  选择 1-${choices.length}`, String(defaultIndex + 1));
  const idx = Number(raw) - 1;
  const chosen = choices[idx] ?? choices[defaultIndex];
  return chosen.value;
}

/** 多选：逗号分隔编号，或 all */
export async function multiSelect(question, choices) {
  if (!process.stdin.isTTY) return [];
  console.log(`? ${question}`);
  choices.forEach((ch, i) => console.log(`    ${i + 1}) ${ch.label}`));
  const raw = await ask('  输入编号(逗号分隔) 或 all', 'all');
  if (raw.toLowerCase() === 'all') return choices.map((ch) => ch.value);
  return raw
    .split(',')
    .map((s) => Number(s.trim()) - 1)
    .filter((i) => i >= 0 && i < choices.length)
    .map((i) => choices[i].value);
}
