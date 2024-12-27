'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextVersion = process.argv[2];
const pkgPath = path.join(__dirname, '..', 'package.json');

const packageJsonText = fs.readFileSync(pkgPath);
const packageJson = JSON.parse(packageJsonText);

const nextPackageJson = { ...packageJson, version: nextVersion };

console.log('\nUPDATING PACKAGE JSON VERSION TO: ', nextVersion);

fs.writeFileSync(pkgPath, JSON.stringify(nextPackageJson, null, 2));
