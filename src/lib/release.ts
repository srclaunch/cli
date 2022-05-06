import Yaml from 'js-yaml';
import path from 'path';
import standardVersion from 'standard-version';
import { readFile, writeFile } from '../lib/file-system';

export async function createRelease() {
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  await standardVersion({
    noVerify: true,
    infile: 'CHANGELOG.md',
    silent: false,
    types: [
      { type: 'feat', section: 'Features' },
      { type: 'fix', section: 'Bug Fixes' },
      { type: 'chore', hidden: true },
      { type: 'docs', hidden: true },
      { type: 'style', hidden: true },
      { type: 'refactor', hidden: true },
      { type: 'perf', hidden: true },
      { type: 'test', hidden: true },
    ],
  });

  const updatedPackageJson = await readFile(path.resolve('./package.json'));
  const updatedPackageJsonContents = JSON.parse(updatedPackageJson.toString());
  const yml = Yaml.dump({
    ...updatedPackageJsonContents,
    version: updatedPackageJsonContents.version,
  });
  await writeFile(path.resolve('./package.yml'), yml.toString());
}
