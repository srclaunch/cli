import standardVersion from 'standard-version';
import Git, { SimpleGit } from 'simple-git';
import chalk from 'chalk';
import { push } from './git.js';

export async function createRelease() {
  const git: SimpleGit = Git();
  const currentBranch = await (await git.branchLocal()).current;

  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  await standardVersion({
    noVerify: true,
    infile: 'CHANGELOG.md',
    silent: false,
  });

  const result = await push({ followTags: true });

  console.log(
    `${chalk.green('✔')} pushed release to ${chalk.bold(
      result.repo,
    )} on branch ${chalk.bold(currentBranch)}`,
  );
}
