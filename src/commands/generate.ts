import { Project } from '@srclaunch/types';
import { Command } from '../lib/command.js';
import { TypedFlags } from 'meow';
import { createNewProjectInteractive } from '../lib/project/create.js';

export type GenerateSrcLaunchProjectFlags = TypedFlags<{
  name: {
    type: 'string';
    required: true;
  };
  description: {
    type: 'string';
    required: true;
  };
  type: {
    type: 'string';
    required: true;
  };
}>;

export default new Command({
  name: 'generate',
  description: `Generate code, configuration, and files for various patterns and libraries.`,
  commands: [
    new Command<Project, GenerateSrcLaunchProjectFlags>({
      name: 'srclaunch-project-config',
      description:
        "Generates a SrcLaunch project config file if one doesn't exist already.",
      async run({ config, flags }): Promise<void> {
        const result = await createNewProjectInteractive({
          name: flags.name,
          description: flags.description,
          type: flags.type,
        });

        console.info('resulttt', result);
      },
    }),
    new Command<Project>({
      name: 'package-yml',
      description:
        'Generates a package.yml file that can be used as a replacement for package.json',
      async run({ config, flags }): Promise<void> {
        // const existingPackageYml = (await fileExists('./package.yml'))
        //   ? await readFile('./package.yml')
        //   : null;
        // const parsedPackageYml: { version: string } | null = existingPackageYml
        //   ? (Yaml.load(existingPackageYml.toString()) as {
        //       version: string;
        //     })
        //   : null;
        // /*
        //     Write package.yml which will be used by the `yarn-plugin-yaml-manifest`
        //     plugin to generate a package.json manifest.
        //   */
        // const packageYml = Yaml.dump(newPackageMetadata);
        // await writeFile(path.resolve('./package.yml'), packageYml.toString());
        // console.info(`${chalk.green('✔')} created package.yml`);
        // console.info('resulttt', result);
      },
    }),
  ],
});
