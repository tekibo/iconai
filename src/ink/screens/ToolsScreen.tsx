import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { OutputFormat } from '../../types';
import { processToolPipeline } from '../../services/imageProcessor';
import InputPath from '../components/tools/InputPath';
import ToolSelector from '../components/tools/ToolSelector';
import FormatPicker from '../components/tools/FormatPicker';
import OutputPath from '../components/tools/OutputPath';

type Section = 'input' | 'tools' | 'format' | 'output';

interface Props {
  onDone: (files: string[]) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

const SECTIONS: Section[] = ['input', 'tools', 'format', 'output'];

export default function ToolsScreen({ onDone, onError, onBack }: Props) {
  const [focus, setFocus] = useState<Section>('input');
  const [editing, setEditing] = useState(false);
  const [subFocus, setSubFocus] = useState(0);
  const [inputPath, setInputPath] = useState('');
  const [removeBg, setRemoveBg] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [outputDir, setOutputDir] = useState('./output');
  const [processing, setProcessing] = useState(false);

  function subItemCount(): number {
    const count = resizeEnabled ? 4 : 2;
    return count;
  }

  useInput((input, key) => {
    if (processing) return;

    if (editing) {
      if (key.escape) { setEditing(false); return; }

      if (focus === 'tools') {
        if (key.downArrow || key.upArrow) {
          const dir = key.downArrow ? 1 : -1;
          const max = subItemCount();
          setSubFocus((subFocus + dir + max) % max);
          return;
        }
        if (key.return || input === ' ') {
          if (subFocus === 0) { setRemoveBg(!removeBg); return; }
          if (subFocus === 1) { setResizeEnabled(!resizeEnabled); if (!resizeEnabled) { setSubFocus(2); } return; }
          return;
        }
        if (subFocus === 2) {
          if (key.backspace) { setResizeWidth(resizeWidth.slice(0, -1)); return; }
          if (/^\d$/.test(input)) { setResizeWidth(resizeWidth + input); return; }
        } else if (subFocus === 3) {
          if (key.backspace) { setResizeHeight(resizeHeight.slice(0, -1)); return; }
          if (/^\d$/.test(input)) { setResizeHeight(resizeHeight + input); return; }
        }
        return;
      }

      if (key.return) { setEditing(false); return; }

      if (focus === 'input') {
        if (key.backspace) { setInputPath(inputPath.slice(0, -1)); return; }
        if (input && !key.ctrl && !key.meta) { setInputPath(inputPath + input); return; }
      } else if (focus === 'format') {
        const fmts: OutputFormat[] = ['png', 'jpeg', 'webp', 'ico'];
        const idx = fmts.indexOf(outputFormat);
        if (key.rightArrow) setOutputFormat(fmts[(idx + 1) % fmts.length]);
        if (key.leftArrow) setOutputFormat(fmts[(idx - 1 + fmts.length) % fmts.length]);
      } else if (focus === 'output') {
        if (key.backspace) { setOutputDir(outputDir.slice(0, -1)); return; }
        if (input && !key.ctrl && !key.meta) { setOutputDir(outputDir + input); return; }
      }
      return;
    }

    if (key.return) {
      if (focus === 'output' && inputPath) {
        setProcessing(true);
        const rw = resizeEnabled && resizeWidth ? parseInt(resizeWidth, 10) : undefined;
        const rh = resizeEnabled && resizeHeight ? parseInt(resizeHeight, 10) : undefined;
        processToolPipeline(inputPath, outputDir, { removeBg, outputFormat, quality: 85, resizeWidth: rw, resizeHeight: rh })
          .then((files) => onDone(files))
          .catch((e) => onError(e.message));
        return;
      }
      setSubFocus(0);
      setEditing(true);
      return;
    }

    if (key.downArrow) {
      const idx = SECTIONS.indexOf(focus);
      if (idx < SECTIONS.length - 1) setFocus(SECTIONS[idx + 1]);
      return;
    }
    if (key.upArrow) {
      const idx = SECTIONS.indexOf(focus);
      if (idx > 0) setFocus(SECTIONS[idx - 1]);
      return;
    }
    if (input === 'q' || input === 'Q') process.exit(0);
    if (input === 'b' || input === 'B') { onBack(); return; }
  });

  return (
    <Box flexDirection="column">
      <InputPath
        inputPath={inputPath}
        editing={focus === 'input' && editing}
        active={focus === 'input'}
      />
      <ToolSelector
        removeBg={removeBg}
        resizeEnabled={resizeEnabled}
        resizeWidth={resizeWidth}
        resizeHeight={resizeHeight}
        editing={focus === 'tools' && editing}
        active={focus === 'tools'}
        subFocus={editing && focus === 'tools' ? subFocus : 0}
      />
      <FormatPicker
        outputFormat={outputFormat}
        editing={focus === 'format' && editing}
        active={focus === 'format'}
      />
      <OutputPath
        outputDir={outputDir}
        editing={focus === 'output' && editing}
        active={focus === 'output'}
      />

      <Box>
        <Text dimColor>{'─'.repeat(60)}</Text>
      </Box>

      <Box marginTop={1}>
        {processing ? (
          <Text dimColor>Processing...</Text>
        ) : editing && focus === 'tools' ? (
          <>
            <Text bold>Enter/Space</Text><Text dimColor>·toggle  </Text>
            <Text dimColor>│</Text>
            <Text bold>  ↑↓</Text><Text dimColor>·option  </Text>
            <Text dimColor>│</Text>
            <Text bold>  Esc</Text><Text dimColor>·done</Text>
          </>
        ) : editing ? (
          <>
            <Text bold>Enter</Text><Text dimColor>·confirm  </Text>
            <Text dimColor>│</Text>
            <Text bold>  Esc</Text><Text dimColor>·cancel</Text>
          </>
        ) : focus === 'output' && inputPath ? (
          <>
            <Text bold>Enter</Text><Text dimColor>·process  </Text>
            <Text dimColor>│</Text>
            <Text bold>  ↑↓</Text><Text dimColor>·move  </Text>
            <Text dimColor>│</Text>
            <Text bold>  b</Text><Text dimColor>·back  </Text>
            <Text dimColor>│</Text>
            <Text bold>  q</Text><Text dimColor>·quit</Text>
          </>
        ) : (
          <>
            <Text bold>Enter</Text><Text dimColor>·edit  </Text>
            <Text dimColor>│</Text>
            <Text bold>  ↑↓</Text><Text dimColor>·move  </Text>
            <Text dimColor>│</Text>
            <Text bold>  b</Text><Text dimColor>·back  </Text>
            <Text dimColor>│</Text>
            <Text bold>  q</Text><Text dimColor>·quit</Text>
          </>
        )}
      </Box>
    </Box>
  );
}
