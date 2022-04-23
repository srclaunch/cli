import { Box, BoxProps } from 'ink';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';

type FullScreenProps = PropsWithChildren<BoxProps>;

export const FullScreen = ({
  children,
  ...props
}: FullScreenProps): ReactElement => {
  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    }

    process.stdout.on('resize', onResize);
    process.stdout.write('\x1b[?1049h');

    return () => {
      process.stdout.off('resize', onResize);
      process.stdout.write('\x1b[?1049l');
    };
  }, []);

  return (
    <Box width={size.columns} height={size.rows} {...props}>
      {children}
    </Box>
  );
};
