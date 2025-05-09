import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 主函数
async function generateDocs() {
  const hooksDir = path.join(__dirname, '../src/hooks');
  const docsDir = path.join(__dirname, '../docs');

  // 确保文档目录存在
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }

  // 读取所有 hook 文件
  const files = fs
    .readdirSync(hooksDir)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('index.ts'));

  const generatedFiles = [];

  for (const file of files) {
    const hookName = path.basename(file, '.ts');
    const docPath = path.join(docsDir, `${hookName}.md`);

    // 如果文档已存在则跳过
    if (fs.existsSync(docPath)) {
      continue;
    }

    // 生成文档内容
    const docContent = `# ${hookName}\n\n## Feature\nhere is the feature of ${hookName}.\n\n## Usage\n\`\`\`js\n\`\`\`\n\n## Types\n\`\`\`ts\n\`\`\``;

    // 写入文档文件
    fs.writeFileSync(docPath, docContent);

    generatedFiles.push(hookName);
  }

  if (generatedFiles.length > 0) {
    console.log(`成功生成以下文档: ${generatedFiles.join(', ')}`);
  }
}

generateDocs().catch(console.error);
