import { Box, Text } from 'ink';

interface Props {
  outputDir: string;
  editing: boolean;
  active: boolean;
}

export default function OutputPath({ outputDir, editing, active }: Props) {
  const c = active ? 'cyan' : 'dim';

  if (editing) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyan">● {'Output'.padEnd(6)}</Text>
        <Box paddingLeft={4}>
          <Text color="cyan">&gt; </Text>
          <Text>{outputDir.length === 0 ? <Text dimColor>output directory...</Text> : <Text>{outputDir}<Text color="cyan">▌</Text></Text>}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginBottom={1}>
      <Text color={c}>{active ? '●' : '○'} </Text>
      <Text bold color={c}>{'Output'.padEnd(6)}</Text>
      <Text> </Text>
      <Text color={active ? 'cyan' : undefined}>{outputDir || <Text dimColor>./output/</Text>}</Text>
    </Box>
  );
}
