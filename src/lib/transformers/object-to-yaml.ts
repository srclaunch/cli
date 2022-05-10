import Yaml from 'js-yaml';

export function transformObjectToYaml(obj: Record<string, unknown>) {
  const yaml = Yaml.dump(obj);

  return yaml;
}
