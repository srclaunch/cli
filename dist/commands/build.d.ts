import { Command } from '../lib/command.js';
import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
declare const _default: Command<Project, TypedFlags<{
    clean?: {
        type: 'boolean';
        default: true;
    } | undefined;
}>>;
export default _default;
//# sourceMappingURL=build.d.ts.map