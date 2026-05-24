import { Box, Text } from 'ink';
import { FORMAT_LABELS, OutputFormat } from '../../../types';

interface Props {
  outputFormat: OutputFormat;
  editing: boolean;
  active: boolean;
}

export default function FormatPicker({ outputFormat, editing, active }: Props) {
  const c = active ? 'cyan' : 'dim';

  if (editing) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyan">● {'Format'.padEnd(6)}</Text>
        <Box paddingLeft={4}>
          <Text color="cyan">{FORMAT_LABELS[outputFormat]}</Text>
          <Text dimColor>  {'← →'}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginBottom={1}>
      <Text color={c}>{active ? '●' : '○'} </Text>
      <Text bold color={c}>{'Format'.padEnd(6)}</Text>
      <Text> </Text>
      <Text color={active ? 'cyan' : undefined}>{FORMAT_LABELS[outputFormat]}</Text>
    </Box>
  );
}
