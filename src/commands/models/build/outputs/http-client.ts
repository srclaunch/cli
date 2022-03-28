import { paramCase } from 'change-case';
import fs from 'fs-extra';
import path from 'node:path';
import pluralize from 'pluralize';

function constructHttpClientIndexScript({
  environments,
  models,
}: {
  readonly environments: {
    readonly dev: {
      readonly host: string;
      readonly port: number;
      readonly protocol: string;
    };
    readonly test: {
      readonly host: string;
      readonly port: number;
      readonly protocol: string;
    };
    readonly preview: {
      readonly host: string;
      readonly port: number;
      readonly protocol: string;
    };
    readonly production: {
      readonly host: string;
      readonly port: number;
      readonly protocol: string;
    };
  };
  readonly models: readonly string[];
}) {
  let imports = `import { HttpClient } from '@srclaunch/http-client';
import { Environment } from '@srclaunch/types';
import { getEnvironment } from '@srclaunch/web-environment';
`;

  for (const name of models) {
    imports += `import ${name.toLowerCase()}Endpoints from './${name}Endpoints';\n`;
  }

  return `${imports}

const environment: Environment = getEnvironment();

const hosts = {
  dev: '${environments.dev.protocol}://${environments.dev.host}${
    environments.dev.port !== 80 ? `:${environments.dev.port.toString()}` : ''
  }',
  test: '${environments.test.protocol}://${environments.test.host}${
    environments.test.port !== 80 ? `:${environments.test.port.toString()}` : ''
  }',
  preview: '${environments.preview.protocol}://${environments.preview.host}${
    environments.preview.port !== 80
      ? `:${environments.preview.port.toString()}`
      : ''
  }',
  production: '${environments.production.protocol}://${
    environments.production.host
  }${
    environments.production.port !== 80
      ? `:${environments.production.port.toString()}`
      : ''
  }',
}

export const httpClient = HttpClient({
  basePath: 'core-api',
  // @ts-ignore
  host: hosts[environment.id],
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // headers: { 'X-Requested-With': 'XMLHttpRequest' },
  },
  options: {
    retries: 2,
    retryCondition: err => !err.response,
    retryDelay: 5000,
  },
  preAuthResourceIncludes: '/auth',
  responseType: 'json',
  withCredentials: true,
});

export default {
  ${models.map(name => {
    return `...${name}Endpoints\n`;
  })}
};`;
}

function getHttpClientEndpoints({
  modelName,
  typesProjectName,
}: {
  readonly httpClientProjectName?: string;
  readonly modelName: string;
  readonly typesProjectName: string;
}): string {
  const lowercase = modelName.toLowerCase();
  const lowercasePlural = pluralize(modelName.toLowerCase());
  const capitalizedPlural = pluralize(modelName);
  const urlParam = paramCase(pluralize(modelName));

  return `import { Condition, HttpResponse } from '@srclaunch/types';
  import { stringify } from 'query-string';
  import { httpClient } from './index';
  import { ${modelName} } from '${typesProjectName}';

  function getFormData(props: object) {
    try {
      const formData = new FormData();
      const keys =  Object.keys(props);
     
      for (const key of keys) {
        // @ts-ignore
        const value = props[key];
        if (Array.isArray(value) && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            console.log('item', item);
            
            if ('size' in item) {
              if (item) formData.append(\`\${key}[\${i}]\`, item);
            } else {
              if (item) formData.append(\`\${key}[\${i}]\`, JSON.stringify(item));
            }
          }
        } else {
          if (value) formData.append(key, value);
        }
      }
    
      return formData;
    } catch (err: any) {
      console.error(err);
    }
 }

  export default {
    create${modelName}: (props: ${modelName}): Promise<HttpResponse<${modelName}> | void> => {
      const formData = getFormData(props);
      return httpClient.post('/${urlParam}', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    create${capitalizedPlural}: ({
      ...props
    }: ${modelName}[]): Promise<HttpResponse<${modelName}> | void> =>
      httpClient.post('/${urlParam}', props),
    delete${modelName}: (id: ${modelName}['id']): Promise<HttpResponse<void> | void> =>
      httpClient.delete(\`/${urlParam}/\${id}\`),
    delete${capitalizedPlural}: (ids: ${modelName}['id'][]): Promise<HttpResponse<void> | void> =>
      httpClient.delete(\`/${urlParam}/\${ids.join(',')}\`),
    get${modelName}: (id: ${modelName}['id']): Promise<HttpResponse<${modelName}> | void> =>
      httpClient.get(\`/${urlParam}/\${id}\`),
    get${capitalizedPlural}: ({
      conditions,
      filters,
      limit,
      offset
    }: {
      conditions?: Condition[],
      filters?: Record<string, string>,
      limit?: number;
      offset?: number
    }): Promise<HttpResponse<${modelName}> | void> => 
      httpClient.get(\`/${urlParam}?\${filters ? stringify(filters) : ''}limit=\${limit}&offset=\${offset}\`),
    update${modelName}: (
      id: ${modelName}['id'],
      props: ${modelName},
    ): Promise<HttpResponse<${modelName}> | void> => {
      const formData = getFormData(props);
      return httpClient.put(\`/${urlParam}\/\${id}\`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    update${capitalizedPlural}: (
      {
        ...props
      }: ${modelName}[],
    ): Promise<HttpResponse<${modelName}> | void> =>
      httpClient.put(\`/${urlParam}\`, props),
  };  
  `;
}

export async function buildHttpClient({
  httpClientProjectName,
  modelsPath,
  path: projectPath,
  typesProjectName,
}: {
  readonly httpClientProjectName: string;
  readonly modelsPath: string;
  readonly path: string;
  readonly typesProjectName: string;
}): Promise<void> {
  try {
    const APPLAB_CONFIG_PATH = path.join(path.resolve(), 'applab.config.json');

    const APPLAB_CONFIG = await JSON.parse(
      await (await fs.readFile(APPLAB_CONFIG_PATH)).toString(),
    );
    const APPLAB_DIRECTORY = '.applab';
    const MODELS_PATH = path.join(
      path.resolve(),
      APPLAB_DIRECTORY,
      `${modelsPath}/src`,
    );

    const BUILD_PATH = path.join(
      path.resolve(),
      APPLAB_DIRECTORY,
      `${projectPath}/src`,
    );

    const DIST_PATH = path.join(
      path.resolve(),
      APPLAB_DIRECTORY,
      `${projectPath}/dist`,
    );

    await fs.emptyDir(BUILD_PATH);
    await fs.emptyDir(DIST_PATH);

    const files = await fs.readdir(MODELS_PATH);

    for (const file of files) {
      if (file !== 'index.ts') {
        const name = `${file.toLowerCase().replace('.ts', '')}Endpoints.ts`;

        const modelHttpClientEndpoints = getHttpClientEndpoints({
          httpClientProjectName,
          modelName: file.replace('.ts', ''),
          typesProjectName,
        });

        // logger.info(`Writing ${name} HTTP client endpoints`);

        await fs.writeFile(
          path.join(BUILD_PATH, name),
          modelHttpClientEndpoints,
          'utf8',
        );
      }
    }

    // logger.info(`Writing ${BUILD_PATH}/index.ts`);

    const indexFileContent = constructHttpClientIndexScript({
      environments: APPLAB_CONFIG['core-api'].environments,
      models: files
        .filter(f => f !== 'index.ts')
        .map(file => pluralize(file.toLowerCase()).replace('.ts', '')),
    });

    await fs.writeFile(
      path.join(BUILD_PATH, 'index.ts'),
      indexFileContent,
      'utf8',
    );
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
