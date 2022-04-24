import { TestReporter, TestTool } from '@srclaunch/types';
export declare const DEFAULT_TEST_OPTIONS: {
    concurrency: undefined;
    coverage: {
        directory: string;
        thresholds: {
            global: {
                branches: number;
                functions: number;
                lines: number;
                statements: number;
            };
        };
        reporters: TestReporter[];
    };
    fail: {
        fast: boolean;
        noTests: boolean;
    };
    tool: TestTool;
    verbose: boolean;
};
//# sourceMappingURL=index.d.ts.map