import { TestOptions } from '@srclaunch/types';
import { Report } from 'c8';

export async function run(config: TestOptions) {
  try {
    const report = new Report({
      all: true,
      include: 'src',
      reporter: ['json'],
    });

    await report.run();
  } catch (err) {
    console.error(err);
  }
}
