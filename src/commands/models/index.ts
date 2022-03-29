import { buildModels } from './build/index';
import { listModels } from './list';
import { cli } from '../../index';
import { ensureCwdIsApplabProject } from '../../lib/cli';
import { cleanModels } from './build/clean';

export async function handleModelCommands(command?: string) {
  await ensureCwdIsApplabProject();

  switch (command) {
    case 'clean':
      await cleanModels();
      break;
    case 'build':
      await buildModels();
      break;
    case 'help':
      console.info('Available model commands are: build, list');
      break;
    case 'list':
      await listModels();
      // await constructModelExportIndexScript(flags);
      break;
    default:
      console.error('Unknown model command');
      cli.showHelp();
      break;
  }
}
