// scripts/gen-hook-index.js
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hooksDir = path.resolve(__dirname, '../src/hooks');
const indexFile = path.join(hooksDir, 'index.ts');

// 读取所有 .ts 文件（排除 index.ts 和 .d.ts）
const hookFiles = fs
  .readdirSync(hooksDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && !file.endsWith('.d.ts'));

// 生成 import 语句
const importLines = hookFiles.map((file) => {
  const name = path.basename(file, '.ts');
  return `import { ${name} } from './${name}';`;
});

// 生成 export 语句
const exportLines = [
  'export {',
  ...hookFiles.map((file) => {
    const name = path.basename(file, '.ts');
    return `  ${name},`;
  }),
  '};',
];

// 合并最终内容
const content = [...importLines, '', ...exportLines].join('\n') + '\n';

// 写入 index.ts
fs.writeFileSync(indexFile, content, 'utf8');
console.log('✅ hooks/index.ts generated successfully.');
