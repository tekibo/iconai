import { Box, Text, useInput } from 'ink';

interface Props {
  count: number;
  onChange: (count: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function CountPicker({ count, onChange, onConfirm, onBack }: Props) {
  useInput((_input, key) => {
    if (key.escape) { onBack(); return; }
    if (key.leftArrow && count > 1) onChange(count - 1);
    if (key.rightArrow && count < 10) onChange(count + 1);
    if (key.return) onConfirm();
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Number of images (← → arrows, Enter confirm):</Text>
      </Box>
      <Box>
        <Text color="cyan">  {count}  </Text>
        <Text dimColor>(1–10)</Text>
      </Box>
    </Box>
  );
}
