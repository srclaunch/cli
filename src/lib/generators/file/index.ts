import { Exception } from '@srclaunch/exceptions';
import { writeFile } from '../../file-system';
import { Generator, GeneratorOptions, GeneratorOutput } from '../index';

export type FileGeneratorOptions<I = {}> = GeneratorOptions<
  {
    contents?: string;
    extension?: string;
    name: string;
    path?: string;
  } & I
>;

export type FileGeneratorOutput<T = {}> = GeneratorOutput<
  {
    contents: string;
    path: string;
  } & T
>;

export class FileGenerator<Opt = {}, Out = {}> extends Generator<
  FileGeneratorOptions<Opt>,
  FileGeneratorOutput<Out>
> {
  constructor(options: FileGeneratorOptions<Opt>) {
    super(options);
  }

  override async generate(): Promise<FileGeneratorOutput<Out>> {
    const { name, path = '', extension, contents } = this.options;

    if (!name) {
      throw new Exception('FileGenerator: name is required');
    }

    if (!extension) {
      throw new Exception('FileGenerator: extension is required');
    }

    if (!contents) {
      throw new Exception('FileGenerator: contents is required');
    }

    const filePath = `${path}/${name}.${extension}`;

    await writeFile(filePath, contents.toString());

    this.output = await super.generate();

    return this.output;
  }
}
