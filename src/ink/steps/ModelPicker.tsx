import { Box, Text, useInput } from 'ink';
import { MODELS } from '../../types';

interface Props {
  modelIdx: number;
  onChange: (idx: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ModelPicker({ modelIdx, onChange, onConfirm, onBack }: Props) {
  useInput((_input, key) => {
    if (key.escape) { onBack(); return; }
    if (key.downArrow && modelIdx < MODELS.length - 1) onChange(modelIdx + 1);
    if (key.upArrow && modelIdx > 0) onChange(modelIdx - 1);
    if (key.return) onConfirm();
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Select a model (↑↓ arrows, Enter confirm):</Text>
      </Box>
      {MODELS.map((m, i) => {
        const active = i === modelIdx;
        return (
          <Box key={m.id} paddingLeft={active ? 0 : 2}>
            {active && <Text color="cyan">► </Text>}
            <Box flexDirection="column" flexGrow={1}>
              <Text bold={active} color={active ? 'cyan' : undefined}>{m.name}</Text>
              <Text dimColor>  {m.provider} — {m.id}</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
