import { Project, Workspace } from '@srclaunch/types';
import { Result, TypedFlags } from 'meow';

export enum CommandType {
  Project = 'project',
  Workspace = 'workspace',
}

export type RunArguments<T, F = TypedFlags<{}>> = {
  cli: Result<{}>;
  config: T;
  flags: F;
};

export type RunFunction<T, F = TypedFlags<{}>> = (
  args: RunArguments<T, F>,
) => Promise<void>;

export type CommandConstructorArgs<T, F = TypedFlags<{}>> = {
  description: string;
  flags?: F;
  name: string;
  run?: RunFunction<T, F>;
  commands?: Command<T, F>[];
  type?: CommandType;
};

export class Command<T, F = TypedFlags<{}>> {
  flags?: F;
  name: string;
  private runFunction?: RunFunction<T, F>;
  commands: CommandConstructorArgs<T, F>['commands'];
  type: CommandType = CommandType.Project;

  constructor(options: CommandConstructorArgs<T, F>) {
    this.name = options.name;
    this.commands = options.commands;
    this.flags = options.flags;
    this.type = options.type ?? CommandType.Project;
    this.runFunction = options.run as RunFunction<T, F>;
  }

  public async run({ cli, config, flags }: RunArguments<T, F>): Promise<void> {
    if (this.runFunction) {
      return await this.runFunction({
        cli,
        config: config as T,
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
  type = CommandType.Project,
}: {
  cli: Result<{}>;
  command: string[];
  commands?: Command<any>[];
  config: unknown;
  flags: TypedFlags<{}> & Record<string, unknown>;
  type: CommandType;
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
      commands: matchingCommand.commands,
      flags,
      type,
    });
  }
}
