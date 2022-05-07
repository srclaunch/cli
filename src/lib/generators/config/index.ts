import {
  FileGenerator,
  FileGeneratorOptions,
  FileGeneratorOutput,
} from '../file';

export type ConfigGeneratorOptions<T = {}> = FileGeneratorOptions<{} & T>;
export type ConfigGeneratorOutput<T = {}> = FileGeneratorOutput<{} & T>;

export class ConfigGenerator<Opt = {}, Out = {}> extends FileGenerator<
  ConfigGeneratorOptions<Opt>,
  ConfigGeneratorOutput<Out>
> {
  constructor(options: FileGeneratorOptions<Opt>) {
    super(options);
  }
}
