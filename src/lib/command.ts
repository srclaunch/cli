import { AnyFlags, Result, TypedFlags } from 'meow';

export enum CommandType {
  Project = 'project',
  Workspace = 'workspace',
}

export type RunArguments<C, F> = {
  cli: Result<AnyFlags>;
  config: C;
  flags: F;
};

export type RunFunction<
  C,
  F = TypedFlags<AnyFlags> & Record<string, unknown>,
> = (args: RunArguments<C, F>) => Promise<void>;

export type CommandConstructorArgs<
  C,
  F = TypedFlags<AnyFlags> & Record<string, unknown>,
> = {
  description: string;
  flags?: F;
  name: string;
  run?: RunFunction<C, F>;
  commands?: Command<C, F>[];
  type?: CommandType;
};

export class Command<C, F = TypedFlags<AnyFlags> & Record<string, unknown>> {
  flags?: F;
  name: string;
  private runFunction?: RunFunction<
    C,
    TypedFlags<AnyFlags> & Record<string, unknown>
  >;
  commands: CommandConstructorArgs<
    C,
    TypedFlags<AnyFlags> & Record<string, unknown>
  >['commands'];
  type: CommandType = CommandType.Project;

  constructor(options: CommandConstructorArgs<C, F>) {
    this.name = options.name;
    this.commands = options.commands as CommandConstructorArgs<
      C,
      TypedFlags<AnyFlags> & Record<string, unknown>
    >['commands'];
    this.flags = options.flags;
    this.type = options.type ?? CommandType.Project;
    this.runFunction = options.run as RunFunction<
      C,
      TypedFlags<AnyFlags> & Record<string, unknown>
    >;
  }

  public async run({
    cli,
    config,
    flags,
  }: RunArguments<
    C,
    TypedFlags<AnyFlags> & Record<string, unknown>
  >): Promise<void> {
    if (this.runFunction) {
      return await this.runFunction({
        cli,
        config,
        flags,
      });
    }
  }
}

export async function handleCommand({
  cli,
  config,
  command,
  commands,
  flags,
}: {
  cli: Result<AnyFlags>;
  command: string[];
  commands?: Command<any, TypedFlags<AnyFlags> & Record<string, unknown>>[];
  config: Record<string, unknown>;
  flags: TypedFlags<AnyFlags> & Record<string, unknown>;
}): Promise<void> {
  if (!command || command.length === 0 || !command[0]) {
    console.error('No command specified');
    return;
  }

  if (!commands) {
    console.error('No commands specified');
    return;
  }

  const commandName = command[0];
  const matchingCommand = commands.find(cmd => cmd.name === commandName);

  if (!matchingCommand) {
    console.error(`Unknown command ${commandName}`);
    return;
  }

  if (command.length === 1) {
    matchingCommand.run({
      cli,
      config,
      flags,
    });
  } else if (command.length > 1) {
    handleCommand({
      cli,
      config,
      command: command.slice(1),
      commands: matchingCommand?.commands,
      flags,
    });
  }
}
