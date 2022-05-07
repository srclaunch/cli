import { Generator as Generators } from '@srclaunch/types';

export type GeneratorOption<
  T = boolean | number | Record<string, unknown> | string,
> = T;

export type GeneratorOptions<T = {}> = {
  [key: string]: GeneratorOption;
} & T;

export type GeneratorOutput<T = {}> = {
  [key: string]: boolean | number | Record<string, unknown> | string;
} & T;

interface GeneratorProps<Opt = {}, Out = {}> {
  generate(): Promise<Out>;
  readonly name: string;
  readonly description: string;
  options?: GeneratorOptions<Opt>;
  output?: Out | GeneratorOutput;
}

export class Generator<Opt = {}, Out = {}> implements GeneratorProps<Opt, Out> {
  name = 'BaseGenerator';
  description = 'Base Generator inherited by other generators';
  options: GeneratorOptions<Opt> = {} as GeneratorOptions<Opt>;
  output?: GeneratorOutput<Out> = {} as GeneratorOutput<Out>;

  constructor(options: GeneratorOptions<Opt>) {
    this.options = options as GeneratorOptions<Opt>;
  }

  async generate(): Promise<GeneratorOutput<Out>> {
    return {} as GeneratorOutput<Out>;
  }
}
