import { Box, Text, useInput } from 'ink';
import { PRESET_DEFINITIONS, PRESET_KEYS } from '../../types';

interface Props {
  presetIdx: number;
  onChange: (idx: number) => void;
  onConfirm: () => void;
}

export default function PresetPicker({ presetIdx, onChange, onConfirm }: Props) {
  useInput((_input, key) => {
    if (key.downArrow && presetIdx < PRESET_KEYS.length - 1) onChange(presetIdx + 1);
    if (key.upArrow && presetIdx > 0) onChange(presetIdx - 1);
    if (key.return) onConfirm();
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Select a preset (↑↓ arrows, Enter confirm):</Text>
      </Box>
      {PRESET_KEYS.map((key, i) => {
        const d = PRESET_DEFINITIONS[key];
        const active = i === presetIdx;
        return (
          <Box key={key} paddingLeft={active ? 0 : 2}>
            {active && <Text color="cyan">► </Text>}
            <Box flexDirection={active ? 'column' : 'row'} flexGrow={1}>
              <Text bold={active} color={active ? 'cyan' : undefined}>{d.label}</Text>
              <Text dimColor> ({d.width}x{d.height}, {d.aspectRatio})</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
