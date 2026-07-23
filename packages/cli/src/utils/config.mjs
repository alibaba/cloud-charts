import fs from 'node:fs';
import path from 'node:path';

export const CONFIG_FILE = 'cloud-charts.json';

export const DEFAULT_CONFIG = {
  $schema: 'https://cloud-charts.dev/schema.json',
  framework: 'react',
  // 源码来源：'next'(新架构 @alicloud/cloud-charts-*) | 'legacy'(@alicloud/cloud-charts 兼容层)
  source: 'next',
  // 默认安装方式：'copy'(源码复制, shadcn 式) | 'dep'(npm 依赖)
  mode: 'copy',
  registry: '@alicloud/cloud-charts',
  paths: {
    components: 'src/components/charts',
    core: 'src/lib/cloud-charts',
  },
  aliases: {
    components: '@/components/charts',
    core: '@/lib/cloud-charts',
  },
};

export function configPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIG_FILE);
}

export function readConfig(cwd = process.cwd()) {
  const p = configPath(cwd);
  if (!fs.existsSync(p)) return null;
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch (e) {
    throw new Error(`${CONFIG_FILE} 解析失败: ${e.message}`);
  }
}

export function writeConfig(config, cwd = process.cwd()) {
  fs.writeFileSync(configPath(cwd), JSON.stringify(config, null, 2) + '\n', 'utf8');
}
