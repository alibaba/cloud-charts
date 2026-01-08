#!/usr/bin/env node

/**
 * CloudCharts 构建工具迁移脚本
 * 从 Webpack 4 + build-scripts 迁移到 Vite
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');
const SCRIPTS = join(ROOT, 'scripts');

console.log('🚀 开始构建工具迁移...\n');

// 1. 创建 Vite 配置
console.log('📦 步骤 1: 创建 Vite 配置');
const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [react()],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CloudCharts',
      fileName: (format) => \`index.\${format}.js\`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@antv/g2',
        '@antv/data-set',
        'lodash',
        'classnames',
        'resize-observer-polyfill',
        'tinycolor2'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@antv/g2': 'G2',
          '@antv/data-set': 'DataSet',
          lodash: '_',
          classnames: 'classNames',
          'resize-observer-polyfill': 'ResizeObserver',
          tinycolor2: 'tinycolor'
        }
      }
    },
    define: {
      __VERSION__: JSON.stringify(packageJson.version),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  
  resolve: {
    alias: {
      '@alicloud/cloud-charts': resolve(__dirname, 'src')
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \`@import "./src/themes/variables.scss";\`
      }
    }
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.stories.{js,jsx,ts,tsx}',
        '**/AI-SKILLS/**'
      ]
    }
  }
});
`;

writeFileSync(join(ROOT, 'vite.config.ts'), viteConfig);
console.log('✅ vite.config.ts 已创建\n');

// 2. 创建主题编译脚本
console.log('📦 步骤 2: 创建主题编译脚本');
if (!existsSync(SCRIPTS)) {
  mkdirSync(SCRIPTS, { recursive: true });
}

const themeScript = `#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { compileString } from 'sass';

function extractVariables(css) {
  const vars = {};
  const varRegex = /\\$([a-zA-Z0-9-]+):\\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(css)) !== null) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}

function compileTheme(themePath, outputPath) {
  try {
    const scss = readFileSync(themePath, 'utf-8');
    const result = compileString(scss, {
      loadPaths: [resolve(__dirname, '../src/themes')]
    });
    
    const vars = extractVariables(result.css);
    const content = \`export default \${JSON.stringify(vars, null, 2)};\`;
    
    writeFileSync(outputPath, content);
    console.log(\`✅ 编译主题: \${themePath.split('/').pop()} → \${outputPath.split('/').pop()}\`);
    return true;
  } catch (error) {
    console.error(\`❌ 编译失败: \${themePath}\`, error.message);
    return false;
  }
}

function main() {
  console.log('🎨 编译 SCSS 主题变量...\n');
  
  const themePath = resolve(__dirname, '../src/themes');
  const themes = readdirSync(themePath).filter(f => f.endsWith('.scss'));
  
  let success = 0;
  themes.forEach(theme => {
    if (theme === 'base.scss' || theme === 'index.scss') return;
    
    const input = resolve(themePath, theme);
    const output = resolve(themePath, theme.replace('.scss', '.style.ts'));
    
    if (compileTheme(input, output)) {
      success++;
    }
  });
  
  console.log(\`\\n📊 完成: \${success}/\${themes.length - 2} 主题编译成功\`);
}

main();
`;

writeFileSync(join(SCRIPTS, 'compile-themes.js'), themeScript);
console.log('✅ scripts/compile-themes.js 已创建\n');

// 3. 创建 G2 迁移脚本
const g2Script = `#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// G2 4.x → 5.x API 映射表
const API_MIGRATIONS = [
  {
    pattern: /chart\\.interval\\(\\)\\.position\\(['"]([^'"]+)['"]\\)/g,
    replacement: (match, fields) => {
      const [x, y] = fields.split('*');
      return \`chart.interval().encode('x', '\${x}').encode('y', '\${y}')\`;
    }
  },
  {
    pattern: /chart\\.scale\\(\\{([^}]+)\\}\\)/g,
    replacement: (match, config) => {
      // 简化处理，实际需要更复杂的解析
      return match; // 保持原样，需要手动检查
    }
  },
  {
    pattern: /\\.adjust\\(['"]stack['"]\\)/g,
    replacement: '.adjust("stack")'
  },
  {
    pattern: /\\.adjust\\(['"]dodge['"]\\)/g,
    replacement: '.adjust("dodge")'
  }
];

function migrateComponent(filePath) {
  console.log(\`🔄 处理: \${filePath.split('/').pop()}\`);
  
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  // 应用迁移规则
  API_MIGRATIONS.forEach(migration => {
    if (typeof migration.replacement === 'function') {
      content = content.replace(migration.pattern, migration.replacement);
    } else {
      content = content.replace(migration.pattern, migration.replacement);
    }
  });
  
  if (content !== original) {
    writeFileSync(filePath, content);
    console.log(\`  ✅ 已更新\`);
    return true;
  } else {
    console.log(\`  ⚠️  需要手动检查\`);
    return false;
  }
}

function main() {
  console.log('🔄 G2 5.x API 迁移...\n');
  
  const srcDir = resolve(__dirname, '../src');
  const components = readdirSync(srcDir).filter(f => 
    f.startsWith('W') && !f.includes('.')
  );
  
  let updated = 0;
  components.forEach(comp => {
    const compPath = resolve(srcDir, comp, 'index.tsx');
    if (existsSync(compPath)) {
      if (migrateComponent(compPath)) {
        updated++;
      }
    }
  });
  
  console.log(\`\\n📊 完成: \${updated}/\${components.length} 组件已更新\`);
  console.log('⚠️  请手动检查以下文件:');
  console.log('  - chart.scale() 调用');
  console.log('  - 复杂的轴配置');
  console.log('  - 自定义几何图形');
}

main();
`;

writeFileSync(join(SCRIPTS, 'migrate-g2.js'), g2Script);
console.log('✅ scripts/migrate-g2.js 已创建\n');

// 4. 更新 package.json
console.log('📦 步骤 3: 更新 package.json');
const packageJsonPath = join(ROOT, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// 备份原文件
writeFileSync(
  join(ROOT, 'package.json.backup'),
  JSON.stringify(packageJson, null, 2)
);

// 更新配置
packageJson.type = 'module';
packageJson.scripts = {
  ...packageJson.scripts,
  dev: 'vite',
  build: 'node scripts/compile-themes.js && vite build && tsc --emitDeclarationOnly',
  'build:themes': 'node scripts/compile-themes.js',
  'build:types': 'tsc --emitDeclarationOnly',
  preview: 'vite preview',
  test: 'vitest',
  'test:ui': 'vitest --ui',
  'test:coverage': 'vitest --coverage',
  'docs': 'typedoc --out docs src/index.ts'
};

packageJson.peerDependencies = {
  react: '^18.2.0',
  'react-dom': '^18.2.0'
};

packageJson.devDependencies = {
  ...packageJson.devDependencies,
  'vite': '^5.0.0',
  '@vitejs/plugin-react': '^4.2.0',
  'vitest': '^1.0.0',
  '@testing-library/react': '^14.0.0',
  '@testing-library/jest-dom': '^6.0.0',
  'jsdom': '^23.0.0',
  'typedoc': '^0.25.0',
  'typescript': '^5.3.0'
};

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ package.json 已更新\n');

// 5. 创建 TypeScript 配置
console.log('📦 步骤 4: 更新 TypeScript 配置');
const tsConfigPath = join(ROOT, 'tsconfig.json');
const tsConfig = {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    lib: ['ES2020', 'DOM'],
    jsx: 'react',
    moduleResolution: 'bundler',
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    declaration: true,
    declarationDir: './dist',
    outDir: './dist',
    rootDir: './src',
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist', 'test', '**/*.test.ts', '**/*.spec.ts']
};

writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
console.log('✅ tsconfig.json 已更新\n');

// 6. 创建测试设置文件
console.log('📦 步骤 5: 创建测试配置');
const testDir = join(ROOT, 'test');
if (!existsSync(testDir)) {
  mkdirSync(testDir, { recursive: true });
}

const setupFile = `import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Console 覆盖
beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});
`;

writeFileSync(join(testDir, 'setup.ts'), setupFile);
console.log('✅ test/setup.ts 已创建\n');

// 7. 安装依赖提示
console.log('📦 步骤 6: 依赖安装');
console.log('请运行以下命令安装新依赖:\n');
console.log('  npm install');
console.log('  npm install -D vite @vitejs/plugin-react vitest @testing-library/react @testing-library/jest-dom jsdom typedoc\n');

console.log('✅ 迁移脚本执行完成！\n');
console.log('📋 下一步:');
console.log('  1. 运行: npm install');
console.log('  2. 测试: npm run build');
console.log('  3. 验证: npm run test');
console.log('  4. 检查: npm run dev\n');

