import { Workspace } from '@srclaunch/types';
export declare type ModelsBuildOptions = {
    paths: {
        dependencies: Workspace['dependencies'];
    };
};
export declare function buildModels(path: string, { dependencies }: {
    dependencies: Workspace['dependencies'];
}): Promise<void>;
//# sourceMappingURL=index.d.ts.map