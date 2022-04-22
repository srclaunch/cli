import { TestOptions } from '@srclaunch/types';
import { Report } from 'c8';
import path from 'path';

export async function run(
  config: TestOptions,
  srcPath?: string,
): Promise<Report> {
  try {
    const report = new Report({
      all: true,
      src: [path.join(process.cwd(), srcPath ?? 'src')],
      reporter: ['json'],
    });

    await report.run();

    return report;
  } catch (err) {
    throw err;
  }
}
