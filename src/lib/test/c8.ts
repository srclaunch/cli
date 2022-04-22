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
      reportsDirectory: path.resolve(process.cwd(), 'coverage'),
      src: [path.join(process.cwd(), srcPath ?? 'src')],
      tempDirectory: path.resolve(process.cwd(), 'coverage'),
      reporter: ['json'],
    });

    await report.run();

    return report;
  } catch (err) {
    throw err;
  }
}
