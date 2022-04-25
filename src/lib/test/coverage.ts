import { TestOptions } from '@srclaunch/types';
import { Report } from 'c8';
import chalk from 'chalk';
import { emptyDir, ensureDir } from 'fs-extra';
import path from 'path';
import { DEFAULT_TEST_OPTIONS } from './index';

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
      reportsDirectory: coverageDir,
      src: [path.join(process.cwd(), 'src')],
      tempDirectory: coverageDir,
      reporter:
        config.coverage?.reporters ?? DEFAULT_TEST_OPTIONS.coverage.reporters,
    });

    await report.run();

    console.info(
      `${chalk.green('✔')} generated coverage report in ${chalk.bold(
        coverageDir,
      )}`,
    );

    return report;
  } catch (err) {
    throw err;
  }
}
