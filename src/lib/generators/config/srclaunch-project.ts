import { Project } from '@srclaunch/types';
import {
  ConfigGenerator,
  ConfigGeneratorOptions,
  ConfigGeneratorOutput,
} from '.';
import { SrcLaunchConfigFile } from '../../config';

export type SrcLaunchProjectConfigGeneratorOptions<T = {}> = {
  file?: ConfigGeneratorOptions<{
    extension?: SrcLaunchConfigFile['extension'];
    name: SrcLaunchConfigFile['name'];
  }>;
  name: string;
  description: string;
  type: Project['type'];
} & T;

export type SrcLaunchConfigGeneratorOutput<T = {}> = ConfigGeneratorOutput<
  {
    name: string;
    description: string;
    type: Project['type'];
  } & T
>;

export class SrcLaunchProjectConfigGenerator<
  Opt = {},
  Out = {},
> extends ConfigGenerator<
  SrcLaunchProjectConfigGeneratorOptions<Opt>,
  SrcLaunchConfigGeneratorOutput<Out>
> {
  constructor(input: SrcLaunchProjectConfigGeneratorOptions<Opt>) {
    super({ ...input, file: { ...input.file, extension: 'json' } });
  }

  override async generate(): Promise<SrcLaunchConfigGeneratorOutput<Out>> {
    const { name, description, type } = this.options;

    if (!name) {
      throw new Error('SrcLaunchProjectConfigGenerator: name is required');
    }

    if (!description) {
      throw new Error(
        'SrcLaunchProjectConfigGenerator: description is required',
      );
    }

    if (!type) {
      throw new Error('SrcLaunchProjectConfigGenerator: type is required');
    }

    this.output = await super.generate();

    return this.output;
  }
}
