const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'));

const { name, version } = packageJson;

const fileHeader = `// THIS FILE IS AUTO-GENERATED, DO NOT EDIT!\n`;

fs.writeFileSync(
  path.join(currentDir, 'src/packageInfo.ts'),
  `${fileHeader}\nexport const packageInfo = { name: '${name}', version: '${version}' };\n`,
);
