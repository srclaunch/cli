import { TestOptions } from '@srclaunch/types';
import { Report } from 'c8';
import { ensureDir } from 'fs-extra';
import path from 'path';

export async function run(
  config: TestOptions,
  srcPath?: string,
): Promise<Report> {
  try {
    const srcDir = path.join(process.cwd(), srcPath ?? 'src');
    const coverageDir = path.join(
      process.cwd(),
      config.coverage?.directory ?? 'coverage',
    );

    await ensureDir(srcDir);
    await ensureDir(coverageDir);

    const report = new Report({
      all: true,
      exclude: ['src/tests/**'],
      reportsDirectory: coverageDir,
      src: [srcDir],
      tempDirectory: coverageDir,
      reporter: ['lcov', 'json'],
    });

    await report.run();

    return report;
  } catch (err) {
    throw err;
  }
}
