import { AnyFlags, Result, TypedFlags } from 'meow';
export declare enum CommandType {
    Project = "project",
    Workspace = "workspace"
}
export declare type RunArguments<C, F> = {
    cli: Result<AnyFlags>;
    config: C;
    flags: F;
};
export declare type RunFunction<C, F> = (args: RunArguments<C, F>) => Promise<void>;
export declare type CommandConstructorArgs<C, F> = {
    description: string;
    flags?: F;
    name: string;
    run?: RunFunction<C, F>;
    commands?: Command<C, F>[];
    type?: CommandType;
};
export declare class Command<C, F = TypedFlags<AnyFlags> & Record<string, unknown>> {
    flags?: F;
    name: string;
    private runFunction?;
    commands: CommandConstructorArgs<C, F>['commands'];
    type: CommandType;
    constructor(options: CommandConstructorArgs<C, F>);
    run({ cli, config, flags }: RunArguments<C, F>): Promise<void>;
}
export declare function handleCommand({ cli, config, command, commands, flags, }: {
    cli: Result<AnyFlags>;
    command: string[];
    commands?: Command<any, TypedFlags<AnyFlags> & Record<string, unknown>>[];
    config: Record<string, unknown>;
    flags: TypedFlags<AnyFlags> & Record<string, unknown>;
}): Promise<void>;
//# sourceMappingURL=command.d.ts.map