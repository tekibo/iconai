import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { PRESET_DEFINITIONS, PRESET_KEYS, MODELS } from '../../types';

type Section = 'preset' | 'model' | 'count';
type Focus = Section | 'prompt';

interface Props {
  presetIdx: number;
  modelIdx: number;
  prompt: string;
  count: number;
  onPresetChange: (idx: number) => void;
  onModelChange: (idx: number) => void;
  onPromptChange: (v: string) => void;
  onCountChange: (c: number) => void;
  onGenerate: () => void;
  onConfig: () => void;
  onTools: () => void;
}

const SECTIONS: Section[] = ['preset', 'model', 'count'];

export default function GeneratorScreen({
  presetIdx,
  modelIdx,
  prompt,
  count,
  onPresetChange,
  onModelChange,
  onPromptChange,
  onCountChange,
  onGenerate,
  onConfig,
  onTools,
}: Props) {
  const [focus, setFocus] = useState<Focus>('preset');
  const [editing, setEditing] = useState(false);
  const preset = PRESET_KEYS[presetIdx];
  const d = PRESET_DEFINITIONS[preset];
  const m = MODELS[modelIdx];
  const hasPrompt = prompt.trim().length > 0;

  useInput((input, key) => {
    if (focus === 'prompt') {
      if (key.escape) { setFocus('count'); return; }
      if (key.return && hasPrompt) { onGenerate(); return; }
      if (key.return) return;
      if (key.backspace) { onPromptChange(prompt.slice(0, -1)); return; }
      if (input && !key.ctrl && !key.meta) { onPromptChange(prompt + input); return; }
      return;
    }

    if (editing) {
      if (key.escape) { setEditing(false); return; }
      if (key.return) { setEditing(false); return; }
      if (focus === 'preset') {
        if (key.downArrow && presetIdx < PRESET_KEYS.length - 1) onPresetChange(presetIdx + 1);
        if (key.upArrow && presetIdx > 0) onPresetChange(presetIdx - 1);
      } else if (focus === 'model') {
        if (key.downArrow && modelIdx < MODELS.length - 1) onModelChange(modelIdx + 1);
        if (key.upArrow && modelIdx > 0) onModelChange(modelIdx - 1);
      } else if (focus === 'count') {
        if (key.leftArrow && count > 1) onCountChange(count - 1);
        if (key.rightArrow && count < 10) onCountChange(count + 1);
      }
      return;
    }

    if (key.return) { setEditing(true); return; }
    if (key.downArrow) {
      const idx = SECTIONS.indexOf(focus);
      if (idx < SECTIONS.length - 1) setFocus(SECTIONS[idx + 1]);
      else setFocus('prompt');
      return;
    }
    if (key.upArrow) {
      const idx = SECTIONS.indexOf(focus);
      if (idx > 0) setFocus(SECTIONS[idx - 1]);
      return;
    }
    if (input === 'c' || input === 'C') { onConfig(); return; }
    if (input === 't' || input === 'T') { onTools(); return; }
    if (input === 'q' || input === 'Q') { process.exit(0); return; }
  });

  function SectionRow({ section, num, label, active, children }: { section: Section; num: string; label: string; active: boolean; children: React.ReactNode }) {
    const isEditing = editing && active;
    const color = active ? 'cyan' : 'dim';
    if (isEditing) return null;
    return (
      <Box>
        <Text color={active ? 'cyan' : 'dim'}>
          {active ? '●' : '○'} {num}.{' '}
        </Text>
        <Text bold color={color}>{label}</Text>
        <Text>  </Text>
        {children}
      </Box>
    );
  }

  const labelW = (s: string) => s.padEnd(6);

  return (
    <Box flexDirection="column">
      {/* Preset row or expanded */}
      {editing && focus === 'preset' ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="cyan">● {labelW('Preset')}</Text>
          <Box paddingLeft={4} flexDirection="column">
            {PRESET_KEYS.map((key, i) => {
              const p = PRESET_DEFINITIONS[key];
              const sel = i === presetIdx;
              return (
                <Box key={key}>
                  <Text color={sel ? 'cyan' : undefined}>
                    {sel ? '●' : '○'} {p.label}
                  </Text>
                  <Text dimColor>  {p.width}×{p.height}  {p.aspectRatio}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <SectionRow section="preset" num="1" label="Preset" active={focus === 'preset'}>
          <Text color={focus === 'preset' ? 'cyan' : undefined}>{d.label}</Text>
          <Text dimColor>  {d.width}×{d.height}  {d.aspectRatio}</Text>
        </SectionRow>
      )}

      {/* Model row or expanded */}
      {editing && focus === 'model' ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="cyan">● {labelW('Model')}</Text>
          <Box paddingLeft={4} flexDirection="column">
            {MODELS.map((mdl, i) => {
              const sel = i === modelIdx;
              return (
                <Box key={mdl.id}>
                  <Text color={sel ? 'cyan' : undefined}>
                    {sel ? '●' : '○'} {mdl.name}
                  </Text>
                  <Text dimColor>  {mdl.provider}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <SectionRow section="model" num="2" label="Model" active={focus === 'model'}>
          <Text color={focus === 'model' ? 'cyan' : undefined}>{m.name}</Text>
          <Text dimColor>  {m.provider}</Text>
        </SectionRow>
      )}

      {/* Count row or expanded */}
      {editing && focus === 'count' ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="cyan">● {labelW('Count')}</Text>
          <Box paddingLeft={4}>
            <Text color="cyan">{count}</Text>
            <Text dimColor>  {'← →'}</Text>
          </Box>
        </Box>
      ) : (
        <SectionRow section="count" num="3" label="Count" active={focus === 'count'}>
          <Text color={focus === 'count' ? 'cyan' : undefined}>{count}</Text>
        </SectionRow>
      )}

      {/* Prompt area — main thing */}
      <Box
        borderStyle="round"
        borderColor={focus === 'prompt' ? 'cyan' : 'dim'}
        paddingX={1}
        marginTop={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box>
            <Text color="cyan">{'>'}</Text>
            <Text> </Text>
            {focus === 'prompt' ? (
              <Text>
                {prompt.length === 0
                  ? <Text dimColor>type your icon description...</Text>
                  : <Text>{prompt}<Text color="cyan">▌</Text></Text>
                }
              </Text>
            ) : (
              <Text>{prompt || <Text dimColor>type your icon description...</Text>}</Text>
            )}
          </Box>
        </Box>
      </Box>

      {/* Separator */}
      <Box>
        <Text dimColor>{'─'.repeat(60)}</Text>
      </Box>

      {/* Actions */}
      <Box marginTop={1}>
        {focus === 'prompt' ? (
          <>
            {hasPrompt && <><Text bold>Enter</Text><Text dimColor>·generate  </Text></>}
            {!hasPrompt && <><Text dimColor>Enter·write a prompt first  </Text></>}
            <Text dimColor>│</Text>
            <Text bold>  Esc</Text>
            <Text dimColor>·back  </Text>
          </>
        ) : editing ? (
          <>
            <Text bold>Enter</Text>
            <Text dimColor>·confirm  </Text>
            <Text dimColor>│</Text>
            <Text bold>  Esc</Text>
            <Text dimColor>·cancel  </Text>
            <Text dimColor>│</Text>
            {focus !== 'count' && <><Text bold>  ↑↓</Text><Text dimColor>·change  </Text></>}
            {focus === 'count' && <><Text bold>  ←→</Text><Text dimColor>·change  </Text></>}
          </>
        ) : (
          <>
            <Text bold>Enter</Text>
            <Text dimColor>·edit  </Text>
            <Text dimColor>│</Text>
            <Text bold>  ↑↓</Text>
            <Text dimColor>·move  </Text>
            <Text dimColor>│</Text>
            <Text bold>  c</Text>
            <Text dimColor>·config  </Text>
            <Text dimColor>│</Text>
            <Text bold>  t</Text>
            <Text dimColor>·tools  </Text>
            <Text dimColor>│</Text>
            <Text bold>  q</Text>
            <Text dimColor>·quit</Text>
          </>
        )}
      </Box>
    </Box>
  );
}
