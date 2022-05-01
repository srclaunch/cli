import { exec } from 'child_process';

export async function shellExec(command: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
