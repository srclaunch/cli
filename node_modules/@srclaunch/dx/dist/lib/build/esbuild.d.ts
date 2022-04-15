import { BuildFormat, BuildOptions } from '@srclaunch/types';
export interface ESBuildOptions extends Omit<BuildOptions, 'formats' | 'tool'> {
    readonly format: BuildFormat.CJS | BuildFormat.ESM | BuildFormat.UMD;
}
export declare function build({ bundle, format, input, minify, output, platform, sourcemap, splitting, target, treeShaking, types, }: ESBuildOptions): Promise<void>;
//# sourceMappingURL=esbuild.d.ts.map