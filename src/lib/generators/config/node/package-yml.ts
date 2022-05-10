import { PackageOptions, PackageType } from '@srclaunch/types';
import { transformObjectToYaml } from '../../../transformers/object-to-yaml';

export type PackageYMLGeneratorOptions = {
  author?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: {
    node?: string;
    npm?: string;
    yarn?: string;
  };
  exports?: PackageOptions['exports'];
  files?: string[];
  license?: string;
  main?: string;
  module?: string;
  name: string;
  peerDependencies?: Record<string, string>;
  publishConfig?: Record<string, string>;
  scripts?: Record<string, string>;
  type?: PackageType;
  types?: string;
  version?: string;
};

export async function generatePackageJSON({
  author,
  dependencies,
  description,
  devDependencies,
  engines,
  exports,
  files,
  license,
  main,
  module,
  name,
  peerDependencies,
  publishConfig,
  scripts,
  type,
  types,
  version,
}: PackageYMLGeneratorOptions): Promise<string> {
  if (!name) {
    throw new Error('Name is required');
  }

  let exportsProp = {};
  for (const _export of exports ?? []) {
    exportsProp = {
      ...exports,
      [_export.path]: {
        import: _export.import,
        require: _export.require,
      },
    };
  }

  return transformObjectToYaml({
    name,
    description,
    author,
    license,
    version,
    engines,
    publishConfig,
    type,
    main,
    types,
    files,
    module,
    exports: exportsProp,
    scripts,
    dependencies,
    devDependencies,
    peerDependencies,
  });
}
