import { Box, Text, useFocus } from 'ink';
import { ReactElement, useEffect } from 'react';

type ButtonProps = { label: string; onFocus: () => unknown; status?: string };

const Button = ({ label, onFocus, status }: ButtonProps): ReactElement => {
  const { isFocused } = useFocus();

  useEffect(() => {
    if (isFocused) onFocus();
  }, [isFocused, onFocus]);

  const getStatusOrbColor = () => {
    switch (status) {
      case 'started':
        return `#82d800`;
      case 'starting':
      case 'init':
        return `#ffcc00`;
      case 'error':
        return `#cc5222`;
      default:
        return `#ffcc00`;
    }
  };

  return (
    <Box height={1}>
      <Text
        backgroundColor={isFocused ? 'cyanBright' : undefined}
        color={isFocused ? '#000000' : 'grayBright'}
        // bold={isFocused}
      >
        {status && <Text color={getStatusOrbColor()}>{' ●'}</Text>}

        <Text> {label} </Text>
      </Text>
    </Box>
  );
};

export default Button;
