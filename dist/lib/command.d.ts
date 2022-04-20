import { Result, TypedFlags } from 'meow';
export declare enum CommandType {
    Project = "project",
    Workspace = "workspace"
}
export declare type RunArguments<T, F = TypedFlags<{}>> = {
    cli: Result<{}>;
    config: T;
    flags: F;
};
export declare type RunFunction<T, F = TypedFlags<{}>> = (args: RunArguments<T, F>) => Promise<void>;
export declare type CommandConstructorArgs<T, F = TypedFlags<{}>> = {
    description: string;
    flags?: F;
    name: string;
    run?: RunFunction<T, F>;
    commands?: Command<T, F>[];
    type?: CommandType;
};
export declare class Command<T, F = TypedFlags<{}>> {
    flags?: F;
    name: string;
    private runFunction?;
    commands: CommandConstructorArgs<T, F>['commands'];
    type: CommandType;
    constructor(options: CommandConstructorArgs<T, F>);
    run({ cli, config, flags }: RunArguments<T, F>): Promise<void>;
}
export declare function handleCommand({ cli, config, command, commands, flags, }: {
    cli: Result<{}>;
    command: string[];
    commands?: Command<any>[];
    config: unknown;
    flags: TypedFlags<{}> & Record<string, unknown>;
}): Promise<void>;
//# sourceMappingURL=command.d.ts.map