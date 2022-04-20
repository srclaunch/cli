import { Box, DOMElement, measureElement, Text, useInput } from 'ink';
import { createRef, ReactElement, useEffect, useState } from 'react';

type ScrollableProps = { items: string[] };

export const Scrollable = ({ items }: ScrollableProps): ReactElement => {
  const [cursor, setCursor] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [lines, setLines] = useState<
    {
      key: number;
      message: string;
      visible: boolean;
    }[]
  >([]);
  const [isScrollable, setScrollable] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollbarHeight, setScrollbarHeight] = useState(1);
  const [scrollbarOffset, setScrollbarOffset] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      if (cursor > 0) setCursor(cursor - 1);

      setAutoScroll(cursor >= items.length - 1);
    } else if (key.downArrow) {
      if (lines.length > cursor + 1) setCursor(cursor + 1);

      setAutoScroll(cursor >= items.length - 1);
    }
  });

  const ref = createRef<DOMElement>();

  useEffect(() => {
    const height = Math.ceil((lineCount / lines.length) * 100);

    setScrollbarHeight(height);

    setScrollable(lines.length >= lineCount);
  }, [lines.length, lineCount]);

  useEffect(() => {
    if (ref.current) {
      const height = measureElement(ref.current)?.height;

      setLineCount(height ?? 20);
    }
  }, [items]);

  useEffect(() => {
    if (ref.current) {
      const height = measureElement(ref.current)?.height;

      setLineCount(height ?? 20);
    }
  }, []);

  useEffect(() => {
    if (lineCount) {
      setLines(
        items.map((message, k) => {
          const alwaysVisible = k < lineCount && cursor < lineCount;

          const visible =
            alwaysVisible || (k <= cursor && k >= cursor - lineCount);

          return {
            key: k,
            message,
            visible,
          };
        }),
      );
    }
  }, [items, cursor, lineCount]);

  const getCursor = (i: number) => {
    if (i === cursor) {
      return '❯\u00A0';
    }

    return '\u00A0\u00A0';
  };

  useEffect(() => {
    if (autoScroll) setCursor(items.length - 1);
  }, [items.length, autoScroll]);

  useEffect(() => {
    const offset = Math.floor((cursor / lines.length) * 100);

    setScrollbarOffset(offset);
  }, [cursor, lines.length]);

  const getFormattedMessage = (message: string) => {
    if (message.indexOf('src/') === 0) {
      return <Text color={'magenta'}>{message}</Text>;
    }

    return <Text color={'lightGrey'}>{message}</Text>;
  };

  return (
    <Box flexDirection={'row'} minHeight={'100%'} minWidth={'100%'}>
      <Box flexDirection="column" flexGrow={1} ref={ref}>
        <Box flexDirection={'column'} flexGrow={1}>
          {lines.map((line, i) => {
            if (!line.visible) return null;

            return (
              <Text key={i}>
                {!line.visible && 'X '}
                {getCursor(i)}
                {getFormattedMessage(line.message.toString())}
              </Text>
            );
          })}
        </Box>
      </Box>

      {isScrollable && (
        <Box
          alignItems={'stretch'}
          borderStyle={'round'}
          flexGrow={0}
          width={1}
          minHeight={'100%'}
          flexDirection={'column'}
        >
          <Box flexGrow={0} height={`${scrollbarOffset}%`} />
          <Box
            borderStyle={'round'}
            flexGrow={0}
            width={1}
            height={`${scrollbarHeight}%`}
            marginLeft={-1}
          ></Box>
        </Box>
      )}
    </Box>
  );
};
