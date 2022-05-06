import { shellExec } from '../cli';

export async function installDependencies(
  dependencies: string[] | { [dependency: string]: string },
) {
  if (Array.isArray(dependencies)) {
    const command = `yarn add ${dependencies.join(' ')}`;
    await shellExec(command);
  } else if (typeof dependencies === 'object') {
    const command = `yarn add ${[...Object.entries(dependencies)]
      .map(([dependency, version]) => `${dependency}@${version}`)
      .join(' ')}`;
    await shellExec(command);
  } else {
    throw new Error('Invalid dependencies');
  }
}

export async function upgradeDependenciesToLatest(
  dependencies: string[] | { [dependency: string]: string },
) {
  if (Array.isArray(dependencies)) {
    const command = `yarn up ${dependencies.join(' ')}`;
    await shellExec(command);
  } else if (typeof dependencies === 'object') {
    const command = `yarn up ${[...Object.entries(dependencies)]
      .map(([dependency, version]) => `${dependency}@${version}`)
      .join(' ')}`;
    await shellExec(command);
  } else {
    throw new Error('Invalid dependencies');
  }
}
