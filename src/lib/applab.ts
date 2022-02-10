import { readFile } from 'fs/promises';
import path from 'path';
import {Workspace} from "@srclaunch/types";
import fs from "fs";

export async function getAppLabMetadata(): Promise<{
  name: string;
  type: 'web-app';
}> {
  const moduleURL = new URL(import.meta.url);
  const runDir = path.dirname(moduleURL.origin);
  const configPath = `${runDir}/applab.json`;

  const config = await readFile(configPath);

  const configJson = await JSON.parse(config.toString());

  return configJson;
}

export function getWorkspaceConfig(): Workspace {
  return JSON.parse(
    fs
      .readFileSync(path.join(path.resolve(), './applab/workspace.json'))
      .toString(),
  );
}
