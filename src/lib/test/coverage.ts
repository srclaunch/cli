import { TestOptions } from '@srclaunch/types';
import { Report } from 'c8';
import { emptyDir, ensureDir } from 'fs-extra';
import path from 'path';
import { DEFAULT_TEST_OPTIONS } from '.';

export async function run(config: TestOptions): Promise<Report> {
  try {
    const coverageDir = path.join(
      process.cwd(),
      config.coverage?.directory ?? 'coverage',
    );

    await ensureDir(coverageDir);
    await emptyDir(coverageDir);

    const report = new Report({
      all: true,
      exclude: config.files?.include ?? DEFAULT_TEST_OPTIONS.files.include,
      reportsDirectory: coverageDir,
      src: ['src'],
      tempDirectory: coverageDir,
      reporter:
        config.coverage?.reporters ?? DEFAULT_TEST_OPTIONS.coverage.reporters,
    });

    await report.run();

    return report;
  } catch (err) {
    throw err;
  }
}
