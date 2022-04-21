import { Command, CommandType } from './lib/command.js';
export type { Command };
export { CommandType };
export declare const helpMessage = "\nUsage\n  $ srclaunch <command>\n\nCommands\n  build - Build SrcLaunch project if srclaunch.config.json is found in the current directory\n  models\n    * build - Build models into Sequelize models, Typescript definitions and JSON\n  test - Run tests and collect coverage\n\nTo view information for a specific command add \"help\" after the command name, for example:\n  $ srclaunch build help\n";
export declare const cli: import("meow").Result<{
    clean: {
        type: "boolean";
    };
    config: {
        type: "string";
        alias: string;
    };
    help: {
        type: "boolean";
        alias: string;
    };
    version: {
        type: "boolean";
        alias: string;
    };
}>;
export declare function main(): Promise<void>;
declare const _default: Promise<void>;
export default _default;
//# sourceMappingURL=index.d.ts.map