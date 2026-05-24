import { Box, Text } from 'ink';

interface Props {
  removeBg: boolean;
  resizeEnabled: boolean;
  resizeWidth: string;
  resizeHeight: string;
  editing: boolean;
  active: boolean;
  subFocus: number;
}

export default function ToolSelector({ removeBg, resizeEnabled, resizeWidth, resizeHeight, editing, active, subFocus }: Props) {
  const c = active ? 'cyan' : 'dim';

  if (editing) {
    const subItems: Array<{ label: string; idx: number }> = [
      { label: 'Remove Background', idx: 0 },
      { label: 'Resize', idx: 1 },
    ];
    if (resizeEnabled) {
      subItems.push({ label: 'Width', idx: 2 });
      subItems.push({ label: 'Height', idx: 3 });
    }

    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="cyan">● {'Tools'.padEnd(6)}</Text>
        <Box paddingLeft={4} flexDirection="column">
          {(() => {
            const toggled = removeBg ? '●' : '○';
            const focused0 = subFocus === 0;
            return (
              <Box>
                <Text color={focused0 ? 'cyan' : undefined}>{toggled}</Text>
                <Text> </Text>
                <Text color={focused0 ? 'white' : 'dim'}>Remove Background</Text>
                <Text dimColor>  ↑↓ toggle</Text>
              </Box>
            );
          })()}
          {(() => {
            const toggled = resizeEnabled ? '●' : '○';
            const focused1 = subFocus === 1;
            return (
              <Box marginTop={resizeEnabled ? 0 : 0}>
                <Text color={focused1 ? 'cyan' : undefined}>{toggled}</Text>
                <Text> </Text>
                <Text color={focused1 ? 'white' : 'dim'}>Resize</Text>
                {resizeEnabled ? (
                  <Text dimColor>  {resizeWidth || '?'} × {resizeHeight || '?'}</Text>
                ) : (
                  <Text dimColor>  ↑↓ toggle</Text>
                )}
              </Box>
            );
          })()}
          {resizeEnabled && (
            <>
              <Box marginLeft={2} marginTop={0}>
                <Text color={subFocus === 2 ? 'cyan' : 'dim'}>
                  {subFocus === 2 ? '> ' : '  '}Width: {resizeWidth || <Text dimColor>_</Text>}{subFocus === 2 ? <Text color="cyan">▌</Text> : null}
                </Text>
              </Box>
              <Box marginLeft={2}>
                <Text color={subFocus === 3 ? 'cyan' : 'dim'}>
                  {subFocus === 3 ? '> ' : '  '}Height: {resizeHeight || <Text dimColor>_</Text>}{subFocus === 3 ? <Text color="cyan">▌</Text> : null}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  }

  const activeTools: string[] = [];
  if (removeBg) activeTools.push('Remove BG');
  if (resizeEnabled) activeTools.push(`Resize ${resizeWidth || '?'}×${resizeHeight || '?'}`);

  return (
    <Box marginBottom={1}>
      <Text color={c}>{active ? '●' : '○'} </Text>
      <Text bold color={c}>{'Tools'.padEnd(6)}</Text>
      <Text> </Text>
      <Text color={active ? 'cyan' : undefined}>
        {activeTools.length > 0 ? activeTools.join(', ') : <Text dimColor>none selected</Text>}
      </Text>
    </Box>
  );
}
