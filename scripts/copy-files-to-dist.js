const fs = require('fs');
const path = require('path');

const filesToCopy = ['package.json', 'README.md', 'LICENSE'];
const targetDir = 'dist';

if (!fs.existsSync(targetDir)) {
  return;
}

const currentDir = process.cwd();

filesToCopy.forEach((file) => {
  const filePath = path.join(currentDir, file);
  if (!fs.existsSync(filePath)) {
    return;
  }

  fs.copyFileSync(filePath, `${targetDir}/${file}`);
});
