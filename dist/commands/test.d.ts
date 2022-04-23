import { Command } from '../lib/command.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
declare const _default: Command<Project, TypedFlags<{
    coverage: {
        alias: "c";
        default: false;
        description: "Collect test coverage after test run";
        type: "boolean";
    };
    match: {
        alias: "m";
        description: "Run tests matching the specified pattern";
        type: "string";
    };
}>>;
export default _default;
//# sourceMappingURL=test.d.ts.map