import { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ConfigService } from '../services/config';
import { ImageService } from '../services/image';
import { MODELS, PRESET_KEYS, PRESET_DEFINITIONS } from '../types';
import { validateApiKey } from '../utils/validation';
import Header from './components/Header';
import LoadingScreen from './screens/LoadingScreen';
import ConfigScreen from './screens/ConfigScreen';
import GeneratorScreen from './screens/GeneratorScreen';
import ToolsScreen from './screens/ToolsScreen';
import GeneratingScreen from './screens/GeneratingScreen';
import DoneScreen from './screens/DoneScreen';
import ErrorScreen from './screens/ErrorScreen';

type Screen = 'loading' | 'config' | 'generator' | 'tools' | 'generating' | 'done' | 'error';
type ConfigMode = 'initial' | 'change';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [error, setError] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [storedKey, setStoredKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [presetIdx, setPresetIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [count, setCount] = useState(1);
  const [configMode, setConfigMode] = useState<ConfigMode>('initial');

  useEffect(() => {
    ConfigService.get('gateway_api_key').then((key) => {
      if (key) setStoredKey(key);
      setScreen('generator');
    });
  }, []);

  function handleOpenConfig() {
    setConfigMode('change');
    setApiKey('');
    setScreen('config');
  }

  function handleOpenTools() {
    setScreen('tools');
  }

  function handleConfigBack() {
    if (configMode === 'change') {
      setScreen('generator');
    } else {
      process.exit(0);
    }
  }

  async function saveAndContinue(key: string) {
    const err = validateApiKey(key);
    if (err) { setError(err); setScreen('error'); return; }
    await ConfigService.set('gateway_api_key', key);
    setStoredKey(key);
    setScreen('generator');
  }

  async function startGeneration() {
    if (!storedKey) {
      setConfigMode('initial');
      setScreen('config');
      return;
    }
    setScreen('generating');
    try {
      const preset = PRESET_KEYS[presetIdx];

      const images = await ImageService.generateIcon({
        prompt,
        preset,
        model: MODELS[modelIdx].id,
        numImages: count,
        rawPrompt: false,
        isTransparent: false,
      });

      const paths = await ImageService.saveImages(images, './assets', 'png', preset);

      setFiles(paths);
      setScreen('done');
    } catch (e) {
      setError((e as Error).message);
      setScreen('error');
    }
  }

  function handleToolsDone(outputFiles: string[]) {
    setFiles(outputFiles);
    setScreen('done');
  }

  function handleToolsError(msg: string) {
    setError(msg);
    setScreen('error');
  }

  function resetAndRestart() {
    setPrompt('');
    setPresetIdx(0);
    setModelIdx(0);
    setCount(1);
    setFiles([]);
    setError('');
    setScreen('generator');
  }

  function handleQuit() {
    process.exit(0);
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'config' && (
        <ConfigScreen
          apiKey={apiKey}
          currentKey={configMode === 'change' ? storedKey : undefined}
          onChange={setApiKey}
          onSubmit={saveAndContinue}
          onQuit={handleConfigBack}
        />
      )}
      {screen === 'generator' && (
        <GeneratorScreen
          presetIdx={presetIdx}
          modelIdx={modelIdx}
          prompt={prompt}
          count={count}
          onPresetChange={setPresetIdx}
          onModelChange={setModelIdx}
          onPromptChange={setPrompt}
          onCountChange={setCount}
          onGenerate={startGeneration}
          onConfig={handleOpenConfig}
          onTools={handleOpenTools}
        />
      )}
      {screen === 'tools' && (
        <ToolsScreen
          onDone={handleToolsDone}
          onError={handleToolsError}
          onBack={() => setScreen('generator')}
        />
      )}
      {screen === 'generating' && (
        <GeneratingScreen
          preset={PRESET_KEYS[presetIdx]}
          modelIdx={modelIdx}
          prompt={prompt}
          convertingIco={!!PRESET_DEFINITIONS[PRESET_KEYS[presetIdx]].convertToIco}
        />
      )}
      {screen === 'done' && (
        <DoneScreen files={files} onRestart={resetAndRestart} onQuit={handleQuit} />
      )}
      {screen === 'error' && (
        <ErrorScreen error={error} onRestart={resetAndRestart} onQuit={handleQuit} />
      )}
    </Box>
  );
}
