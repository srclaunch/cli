import { Project } from '@srclaunch/types';
import { TypedFlags } from 'meow';
import { Command } from '../lib/command.js';
declare const _default: Command<Project, TypedFlags<{
    ssr: {
        default: false;
        description: "Serve web application using server-side rendering";
        type: "boolean";
    };
}>>;
export default _default;
//# sourceMappingURL=run.d.ts.map