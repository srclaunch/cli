import { transformObjectToYaml } from '../../../transformers/object-to-yaml.js';

export enum YarnNodeLinker {
  PnP = 'pnp',
  NodeModules = 'node-modules',
}

export type YarnConfigGeneratorOptions = {
  nodeLinker?: YarnNodeLinker;
};

export async function generateYarnConfig({
  nodeLinker,
}: YarnConfigGeneratorOptions): Promise<string> {
  const yarnRC = {
    nodeLinker: nodeLinker ?? YarnNodeLinker.NodeModules,
  };
  return transformObjectToYaml(yarnRC).toString();
}
