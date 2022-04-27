import { Environment } from '@srclaunch/types';
export declare type ViteRunOptions = {
    environment?: Environment['id'];
    ssr?: boolean;
};
export declare function run({ environment }: ViteRunOptions): Promise<void>;
//# sourceMappingURL=vite.d.ts.map