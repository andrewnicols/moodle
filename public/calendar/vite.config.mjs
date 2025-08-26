import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs-extra';
import path from 'path';

async function loadAliases (
  baseName,
  baseDir,
) {
  const dirPath = path.resolve(__dirname, baseDir);
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];

  const aliases = {};
  aliases[baseName] = dirPath;

  (await fs.readdir(dirPath))
    .filter((fileName) => extensions.includes(path.extname(fileName)))
    .forEach((fileName) => {
      const fileNameWithoutExtension = path.basename(
        fileName,
        path.extname(fileName),
      );
      const aliasName = `${baseName}/${fileNameWithoutExtension}`;
      aliases[aliasName] = path.resolve(dirPath, fileName);
    });

  return aliases;
}

export default defineConfig(async () => {
  const designSystemAliases = await loadAliases('@DesignSystem', './react/design-system');
  const bootstrapAliases = await loadAliases('@Bootstrap', './node_modules/react-bootstrap/esm');

  return {
    plugins: [react()],
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        ...designSystemAliases,
        ...bootstrapAliases,
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'react/main.jsx'),
        name: 'ReactApp',
        fileName: 'app',
        formats: ['iife'], // Immediately Invoked Function Expression for browser use
      },
      outDir: 'build',
      emptyOutDir: true,
    },
  };
});
