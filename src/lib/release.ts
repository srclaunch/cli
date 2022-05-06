import { ReleaseOptions, ChangesetOptions, ChangeType } from '@srclaunch/types';
import Yaml from 'js-yaml';
import path from 'path';
import standardVersion, { Options } from 'standard-version';
import { DEFAULT_COMMIT_TYPES } from '../constants/releases';
import { readFile, writeFile } from '../lib/file-system';
import { createChangeset } from './changesets';
import { getBranchName, push } from './git';

export async function createRelease({
  changesets,
  publish,
  pipelines,
  push: pushFlag = false,
}: {
  changesets?: ChangesetOptions;
  publish: ReleaseOptions['publish'];
  pipelines: ReleaseOptions['pipelines'];
  push?: boolean;
}): Promise<{
  repo?: string;
  branch: string;
  version: string;
}> {
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  await standardVersion({
    noVerify: true,
    infile: 'CHANGELOG.md',
    silent: false,
    types: (changesets?.types ?? DEFAULT_COMMIT_TYPES) as Options['types'],
  });

  const updatedPackageJson = await readFile('./package.json');
  const updatedPackageJsonContents = JSON.parse(updatedPackageJson.toString());
  const yml = Yaml.dump({
    ...updatedPackageJsonContents,
    version: updatedPackageJsonContents.version,
  });
  await writeFile(path.resolve('./package.yml'), yml.toString());

  await createChangeset({
    files: ['package.yml'],
    type: ChangeType.Release,
    message: `Release ${updatedPackageJsonContents.version}`,
  });

  if (pushFlag) {
    const result = await push({ followTags: true });

    return {
      repo: result.repo,
      branch: await getBranchName(),
      version: updatedPackageJsonContents.version,
    };
  }

  return {
    branch: await getBranchName(),
    version: updatedPackageJsonContents.version,
  };
}
