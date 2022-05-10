import { Project } from '@srclaunch/types';

export async function generateSrcLaunchProjectConfig({
  name,
  description,
  type,
}: Project): Promise<string> {
  if (!name) {
    throw new Error('SrcLaunchProjectConfigGenerator: name is required');
  }

  if (!description) {
    throw new Error('SrcLaunchProjectConfigGenerator: description is required');
  }

  if (!type) {
    throw new Error('SrcLaunchProjectConfigGenerator: type is required');
  }

  return `import { Project } from '@srclaunch/types';

  const config: Project = {
    name: '${name}',
    description: '${description}',
    type: '${type}',
  };

  export default config;
  `;
}
