import chalk from 'chalk';
import fs from "fs-extra";
import path from "path";
import {
  createPackageReadme,
  getPackageVersion,
  getRootDir,
  updateThirdPartyLibsXml,
} from './lib/util.mjs';

/**
 * Update the @moodlehq/design-system bundle and tokens in the lib and public folders.
 * Also updates the version in thirdpartylibs.xml files.
 * The version is read from the npm-shrinkwrap.json file.
 */
async function init() {
  const rootDir = getRootDir();

  const DS_VERSION = getPackageVersion('bootstrap');
  const themeRoot = path.join(rootDir, 'public', 'theme', 'boost');
  const nodeModuleRoot = path.join(rootDir, 'node_modules', 'bootstrap');
  const esmRoot = path.join(themeRoot, 'js', 'esm', 'src');
  const bundleRoot = path.join(esmRoot, 'bootstrap');
  const themeScssRoot = path.join(themeRoot, 'scss', 'bootstrap');

  console.log(chalk.blue.bold.underline('Updating bootstrap bundle to version %s from Node Modules'), DS_VERSION);
  console.log(chalk.blue('Removing old bundles...'));
  fs.removeSync(bundleRoot, { recursive: true, force: true });
  fs.removeSync(themeScssRoot, { recursive: true, force: true });
  console.log(chalk.green('Old bundles removed ✓'));

  // Copy the JS bundles to the lib folder.
  fs.copySync(
    path.join(nodeModuleRoot, 'js', 'dist'),
    path.join(bundleRoot),
  );
  fs.copySync(
    path.join(nodeModuleRoot, 'js', 'index.esm.js'),
    path.join(esmRoot, 'bootstrap.js'),
  );
  console.log(chalk.green(`→ bootstrap:${DS_VERSION} JS bundles ✓`));

  // Copy scss into the themes.
  fs.copySync(
    path.join(nodeModuleRoot, 'scss'),
    path.join(themeScssRoot),
  );
  console.log(chalk.green(`→ bootstrap:${DS_VERSION} tokens ✓`));

  // Create readme files in the package folders.
  console.log(chalk.green(`→ Creating readme_moodle.txt files ✓`));
  createPackageReadme(bundleRoot, 'bootstrap');
  createPackageReadme(themeScssRoot, 'bootstrap');

  // And update the version in thirdpartylibs.xml.
  console.log(chalk.green(`→ Updating thirdpartylibs.xml files ✓`));
  updateThirdPartyLibsXml(themeRoot, 'js/esm/src/bootstrap', 'bootstrap', DS_VERSION);
  updateThirdPartyLibsXml(themeRoot, 'scss/bootstrap', 'bootstrap', DS_VERSION);

  console.log("\nAll bundles saved" + chalk.green(" ✓"));
  console.log("Done!");
}

init().catch((err) => {
  console.error("Download failed:", err.message);
  process.exit(1);
});
