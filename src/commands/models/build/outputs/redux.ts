import fs from 'fs-extra';
import path from 'node:path';
import pluralize from 'pluralize';

function constructReduxReducersIndexScript(models: readonly string[]) {
  const imports = models
    .map(name => {
      const pluralizedCamel = pluralize(name[0]?.toLowerCase() + name.slice(1));

      return `import ${pluralizedCamel} from './${pluralizedCamel}.js';`;
    })
    .join('\n');
  const exports = models
    .map(name => {
      const pluralizedCamel = pluralize(name[0]?.toLowerCase() + name.slice(1));

      return `export { 
        create${name}, 
        create${pluralize(name)}, 
        delete${name}, 
        delete${pluralize(name)}, 
        get${name}, 
        get${pluralize(name)}, 
        update${name},
        update${pluralize(name)},
        ${name}Selectors, 
      } from './${pluralizedCamel}.js';`;
    })
    .join('\n');

  return `${imports}
export default {
  ${models
    .map(name => pluralize(name[0]?.toLowerCase() + name.slice(1)))
    .join(',\n  ')},
};

${exports}
`;
}

function getModelSlice({
  httpClientProjectName,
  modelName,
  typesProjectName,
}: {
  readonly httpClientProjectName?: string;
  readonly modelName: string;
  readonly typesProjectName: string;
}): string {
  const lowercase = modelName.toLowerCase();
  const lowercasePlural = pluralize(modelName.toLowerCase());
  const pluralCamel = pluralize(
    modelName?.[0]?.toLowerCase() + modelName.slice(1),
  );
  const capitalizedPlural = pluralize(modelName);
  const singularCamel = modelName?.[0]?.toLowerCase() + modelName.slice(1);
  const pluralizedCamel = pluralize(
    modelName[0]?.toLowerCase() + modelName.slice(1),
  );

  return `import { ${modelName} } from '${typesProjectName}';
  import * as httpClient from '${httpClientProjectName}';
  
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exception, ExceptionObject } from '@srclaunch/exceptions';
import { AppDispatch, AppThunk, RootState } from '@srclaunch/web-application-state';
import { Condition, ISO8601String } from '@srclaunch/types';

const adapter = createEntityAdapter<${modelName}>();

export const ${modelName}Selectors = adapter.getSelectors<RootState>(
  (state: RootState) => state.${pluralCamel},
);

type ${modelName}State = {
  action: {
    create${modelName}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    create${capitalizedPlural}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    delete${modelName}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    delete${capitalizedPlural}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    get${modelName}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    get${capitalizedPlural}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    update${modelName}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
    update${capitalizedPlural}: {
      error?: ExceptionObject;
      inProgress: boolean;
      lastUpdated?: ISO8601String;
    },
  },
  inProgress?: boolean;
  lastUpdated?: ISO8601String;
};

const initialState = {
  action: {
    create${modelName}: {
      inProgress: false,
    },
    create${capitalizedPlural}: {
      inProgress: false,
    },
    delete${modelName}: {
      inProgress: false,
    },
    delete${capitalizedPlural}: {
      inProgress: false,
    },
    get${modelName}: {
      inProgress: false,
    },
    get${capitalizedPlural}: {
      inProgress: false,
    },
    update${modelName}: {
      inProgress: false,
    },
    update${capitalizedPlural}: {
      inProgress: false,
    },
  },
  inProgress: false,
}

const slice = createSlice({
  initialState: adapter.getInitialState<${modelName}State>(initialState),
  name: '${pluralCamel}',
  reducers: {
    add${modelName}: (state, action) => {
      adapter.upsertOne(state, action.payload);

      state.lastUpdated = new Date().toISOString();
    },
    add${capitalizedPlural}: (state, action) => {
      adapter.upsertMany(state, action.payload);

      state.lastUpdated = new Date().toISOString();
    },

    remove${modelName}: (state, action) => {
      adapter.removeOne(state, action.payload);

      state.lastUpdated = new Date().toISOString();
    },
    remove${capitalizedPlural}: (state, action) => {
      adapter.removeMany(state, action.payload);

      state.lastUpdated = new Date().toISOString();
    },

    update${modelName}: (state, action) => {
      console.log('action.payload', action.payload);
      adapter.updateOne(state, action);

      state.lastUpdated = new Date().toISOString();
    },
    update${capitalizedPlural}: (state, action) => {
      adapter.updateMany(state, action.payload);

      state.lastUpdated = new Date().toISOString();
    },
    setActionError: (state, action: PayloadAction<{
      type: |
        'create${modelName}' | 'create${capitalizedPlural}' |
        'delete${modelName}' | 'delete${capitalizedPlural}' |
        'get${modelName}' | 'get${capitalizedPlural}' |
        'update${modelName}' | 'update${capitalizedPlural}';
      error: ExceptionObject;
    }>) => {
      const { type, error } = action.payload;

      state.action[type].error = error;
      state.lastUpdated = new Date().toISOString();
    },
    setActionInProgress: (state, action: PayloadAction<{
      type: |
        'create${modelName}' | 'create${capitalizedPlural}' |
        'delete${modelName}' | 'delete${capitalizedPlural}' |
        'get${modelName}' | 'get${capitalizedPlural}' |
        'update${modelName}' | 'update${capitalizedPlural}';
      inProgress: boolean;
    }>) => {
      const { type, inProgress } = action.payload;

      state.inProgress = inProgress;
      state.action[type].inProgress = inProgress;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const create${modelName} = (${singularCamel}: ${modelName}): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'create${modelName}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.create${modelName}(${singularCamel});
  
      dispatch(slice.actions.add${modelName}(response?.body));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'create${modelName}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error creating ${modelName}', { cause: err });
      
      dispatch(slice.actions.setActionError({
        type: 'create${modelName}',
        error: exception.toJSON(),
      }));

      dispatch(slice.actions.setActionInProgress({
        type: 'create${modelName}',
        inProgress: false,
      }));
    }
  };

export const create${capitalizedPlural} = (${pluralizedCamel}: ${modelName}[]): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'create${capitalizedPlural}',
        inProgress: true,
      }));

      const response = await httpClient.default.create${capitalizedPlural}(${pluralizedCamel});
      
      dispatch(slice.actions.add${capitalizedPlural}(response?.body));

      dispatch(slice.actions.setActionInProgress({
        type: 'create${capitalizedPlural}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error creating ${capitalizedPlural}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'create${capitalizedPlural}',
        error: exception.toJSON(),
      }));

      dispatch(slice.actions.setActionInProgress({
        type: 'create${capitalizedPlural}',
        inProgress: false,
      }));
    }
  };

export const delete${modelName} = (${singularCamel}: ${modelName}['id']): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'delete${modelName}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.delete${modelName}(${singularCamel});
      
      dispatch(slice.actions.remove${modelName}(${singularCamel}));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'delete${modelName}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error deleting ${modelName}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'delete${modelName}',
        error: exception.toJSON(),
      }));

      dispatch(slice.actions.setActionInProgress({
        type: 'delete${modelName}',
        inProgress: false,
      }));
    }
  };

export const delete${capitalizedPlural} = (${pluralizedCamel}: ${modelName}['id'][]): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'delete${capitalizedPlural}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.delete${capitalizedPlural}(${pluralizedCamel});
  
      dispatch(slice.actions.remove${capitalizedPlural}(response?.body));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'delete${capitalizedPlural}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error deleting ${capitalizedPlural}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'delete${capitalizedPlural}',
        error: exception.toJSON(),
      }));

      dispatch(slice.actions.setActionInProgress({
        type: 'delete${capitalizedPlural}',
        inProgress: false,
      }));
    }
  };

export const get${modelName} = (${singularCamel}: ${modelName}['id']): AppThunk => 
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'get${modelName}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.get${modelName}(${singularCamel});
  
      if (response?.body) {
        dispatch(slice.actions.add${modelName}(response?.body));
      }
  
      dispatch(slice.actions.setActionInProgress({
        type: 'get${modelName}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error getting ${modelName}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'get${modelName}',
        error: exception.toJSON(),
      }));

      dispatch(slice.actions.setActionInProgress({
        type: 'get${modelName}',
        inProgress: false,
      }));
    }
  };

export const get${capitalizedPlural} = ({
  conditions = [],
  filters = {},
  limit = 100,
  offset = 0
}: { 
  conditions?: Condition[],
  filters?: Record<string, string>,
  limit?: number;
  offset?: number
}): AppThunk =>  async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    dispatch(slice.actions.setActionInProgress({
      type: 'get${capitalizedPlural}',
      inProgress: true,
    }));

    const response = await httpClient.default.get${capitalizedPlural}({
      conditions,
      filters,
      limit,
      offset
    });

    dispatch(slice.actions.add${capitalizedPlural}(response?.body));

    dispatch(slice.actions.setActionInProgress({
      type: 'get${capitalizedPlural}',
      inProgress: false,
    }));
  } catch (err: any) {
    const exception = new Exception('Error getting ${capitalizedPlural}', { cause: err });

    dispatch(slice.actions.setActionError({
      type: 'get${capitalizedPlural}',
      error: exception.toJSON(),
    }));

    dispatch(slice.actions.setActionInProgress({
      type: 'get${capitalizedPlural}',
      inProgress: false,
    }));
  }
};


export const update${modelName} = (${singularCamel}: ${modelName}): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'update${modelName}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.update${modelName}(${singularCamel}.id, ${singularCamel});
  
      if (response?.body) {
        dispatch(slice.actions.update${modelName}({ id: ${singularCamel}.id, changes: response.body }));
    
        dispatch(slice.actions.setActionInProgress({
          type: 'update${modelName}',
          inProgress: false,
        }));
      }
    } catch (err: any) {
      const exception = new Exception('Error updating ${modelName}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'update${modelName}',
        error: exception.toJSON(),
      }));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'update${modelName}',
        inProgress: false,
      }));
    }
  };
  

export const update${capitalizedPlural} = (${pluralizedCamel}: ${modelName}[]): AppThunk =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(slice.actions.setActionInProgress({
        type: 'update${capitalizedPlural}',
        inProgress: true,
      }));
  
      const response = await httpClient.default.update${capitalizedPlural}(${pluralizedCamel});
      
      dispatch(slice.actions.update${capitalizedPlural}(response?.body));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'update${capitalizedPlural}',
        inProgress: false,
      }));
    } catch (err: any) {
      const exception = new Exception('Error updating ${capitalizedPlural}', { cause: err });

      dispatch(slice.actions.setActionError({
        type: 'update${capitalizedPlural}',
        error: exception.toJSON(),
      }));
  
      dispatch(slice.actions.setActionInProgress({
        type: 'update${capitalizedPlural}',
        inProgress: false,
      }));
    }
  };


export default slice.reducer;
  `;
}

export async function buildReduxSlices({
  httpClientProjectName,
  projectPath,
  typesProjectName,
}: {
  readonly httpClientProjectName: string;
  readonly projectPath: string;
  readonly typesProjectName: string;
}): Promise<void> {
  try {
    const MODELS_PATH = path.join(
      path.resolve(),
      '.applab/dependencies/models/src',
    );
    const BUILD_PATH = path.join(path.resolve(), projectPath, 'src');
    const DIST_PATH = path.join(path.resolve(), projectPath, 'dist');

    await fs.emptyDir(BUILD_PATH);
    await fs.emptyDir(DIST_PATH);

    const files = await fs.readdir(MODELS_PATH);

    for (const file of files) {
      if (file !== 'index.ts') {
        const name = pluralize(
          file[0]?.toLowerCase() + file.slice(1).replace('.ts', ''),
        );

        const reduxSlice = getModelSlice({
          httpClientProjectName,
          modelName: file.replace('.ts', ''),
          typesProjectName,
        });

        // logger.info(`Writing ${name} Redux slice`);

        await fs.writeFile(
          path.join(BUILD_PATH, `${name}.ts`),
          reduxSlice,
          'utf8',
        );
      }
    }

    // logger.info(`Writing ${BUILD_PATH}/index.ts`);

    const indexFileContent = constructReduxReducersIndexScript(
      files
        .filter(f => f !== 'index.ts')
        .map(file => pluralize(file).replace('.ts', '')),
    );

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
