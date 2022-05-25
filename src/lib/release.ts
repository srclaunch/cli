import { ReleaseOptions, ChangesetOptions, ChangeType } from '@srclaunch/types';
import { readFile, writeFile } from '@srclaunch/logic';
import Yaml from 'js-yaml';
import path from 'path';
import standardVersion, { Options } from 'standard-version';
import { DEFAULT_COMMIT_TYPES } from '../constants/releases';

import { createChangeset } from './changesets';
import { getBranchName, push } from './git';

export async function createRelease({
  changesets,
  push: pushFlag = false,
}: {
  changesets?: ChangesetOptions;
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
    silent: true,
    types: (changesets?.types ?? DEFAULT_COMMIT_TYPES) as Options['types'],
  });

  const packageJson = await JSON.parse(
    (await readFile('./package.json')).toString(),
  );
  const branch = await getBranchName();

  if (pushFlag) {
    const result = await push({ followTags: true });

    return {
      repo: result.repo,
      branch,
      version: packageJson.version,
    };
  }

  return {
    branch,
    version: packageJson.version,
  };
}
