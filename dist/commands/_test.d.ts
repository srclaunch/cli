import { Command } from '../lib/command.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
declare const _default: Command<Project, TypedFlags<{
    match: {
        alias: "m";
        description: "Run tests matching the specified pattern";
        type: "string";
    };
}>>;
export default _default;
//# sourceMappingURL=_test.d.ts.map