import { render } from 'ink';

import { AppContainer } from '../../components/AppContainer';

export async function runDev({
  cliVersion,
  flags,
}: {
  cliVersion?: string;
  flags: any;
}): Promise<void> {
  const { waitUntilExit } = render(
    <AppContainer cliVersion={cliVersion} flags={flags} />,
  );

  await waitUntilExit();
}
