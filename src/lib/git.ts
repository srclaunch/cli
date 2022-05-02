import Git, { SimpleGit } from 'simple-git';

export async function add(path: string) {
  const git: SimpleGit = Git();

  return git.add(path);
}

export async function commit(message: string) {
  const git: SimpleGit = Git();

  await git.commit(message);
}

export async function push({ followTags = true }: { followTags?: boolean }) {
  const git: SimpleGit = Git();
  const currentBranch = await (await git.branchLocal()).current;

  const currentRepo = await (
    await git.getRemotes()
  ).find(remote => remote.name === 'origin');

  const followTagsArg = followTags ? { '--follow-tags': '' } : undefined;

  const result = await git.push(currentRepo?.name ?? 'origin', currentBranch, {
    ...followTagsArg,
  });

  return result;
}
