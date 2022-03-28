import { TypedFlags } from 'meow';
export declare function ensureCwdIsApplabProject(): Promise<void>;
export declare function run({ cliVersion, command, flags, }: {
    readonly cliVersion?: string;
    readonly command: readonly string[];
    readonly flags: TypedFlags<{}> & Record<string, unknown>;
}): Promise<void>;
//# sourceMappingURL=cli.d.ts.map