import { Command } from '../lib/command.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
declare const _default: Command<Project, TypedFlags<{
    clean: {
        alias: "c";
        default: true;
        description: "Clean build directory before building";
        type: "boolean";
    };
}>>;
export default _default;
//# sourceMappingURL=build.d.ts.map