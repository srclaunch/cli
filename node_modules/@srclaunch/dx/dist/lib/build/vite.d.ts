import { BuildFormat, BuildOptions } from '@srclaunch/types';
export interface ViteBuildOptions extends Omit<BuildOptions, 'bundle' | 'format' | 'splitting' | 'tool' | 'treeShaking'> {
    readonly bundle?: {
        readonly exclude?: readonly string[];
        readonly optimize?: readonly string[];
    };
    readonly format: BuildFormat.CJS | BuildFormat.ESM | BuildFormat.UMD;
}
export declare function build({ assets, bundle, format, formats, input, library, manifest, minify, output, platform, rootDir, sourcemap, target, types, webApp, }: ViteBuildOptions): Promise<void>;
//# sourceMappingURL=vite.d.ts.map