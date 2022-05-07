import { CodeGenerator as CodeGenerators } from '@srclaunch/types';
import { Generator, GeneratorOptions, GeneratorOutput } from '../index';
import { CodeGenerator } from './index';

export type ESModuleGeneratorOptions<T = {}> = GeneratorOptions<
  {
    imports?: Record<string, string>;
    exports?: Record<string, string>;
  } & T
>;
export type ESModuleGeneratorOutput<T = {}> = GeneratorOutput<{} & T>;

export class ESModuleGenerator<Opt = {}, Out = {}> extends CodeGenerator<
  ESModuleGeneratorOptions<Opt>,
  ESModuleGeneratorOutput<Out>
> {
  constructor(input: ESModuleGeneratorOptions<Opt>) {
    super(input);
  }
}
