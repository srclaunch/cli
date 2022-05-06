import { ReleaseOptions, ChangesetOptions, ChangeType } from '@srclaunch/types';
import Yaml from 'js-yaml';
import path from 'path';
import standardVersion, { Options } from 'standard-version';
import { DEFAULT_COMMIT_TYPES } from '../constants/releases';
import { readFile, writeFile } from '../lib/file-system';
import { createChangeset } from './changesets';

export async function createRelease({
  changesets,
  publish,
  pipelines,
}: {
  changesets?: ChangesetOptions;
  publish: ReleaseOptions['publish'];
  pipelines: ReleaseOptions['pipelines'];
}) {
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  await standardVersion({
    noVerify: true,
    infile: 'CHANGELOG.md',
    silent: false,
    types: (changesets?.types ?? DEFAULT_COMMIT_TYPES) as Options['types'],
  });

  const updatedPackageJson = await readFile(path.resolve('./package.json'));
  const updatedPackageJsonContents = JSON.parse(updatedPackageJson.toString());
  const yml = Yaml.dump({
    ...updatedPackageJsonContents,
    version: updatedPackageJsonContents.version,
  });
  await writeFile(path.resolve('./package.yml'), yml.toString());

  createChangeset({
    files: ['package.yml'],
    type: ChangeType.Release,
    message: `Release ${updatedPackageJsonContents.version}`,
  });
}
