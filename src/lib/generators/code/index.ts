import { Generator, GeneratorOptions, GeneratorOutput } from '../index';

export type CodeGeneratorOptions<T = {}> = GeneratorOptions<{} & T>;
export type CodeGeneratorGeneratorOutput<T = {}> = GeneratorOutput<{} & T>;

export class CodeGenerator<Opt = {}, Out = {}> extends Generator<
  CodeGeneratorOptions<Opt>,
  CodeGeneratorGeneratorOutput<Out>
> {
  constructor(input: CodeGeneratorOptions<Opt>) {
    super(input);
  }
}
