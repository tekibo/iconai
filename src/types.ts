export type IconPreset = 'app-store-icon' | 'play-store-icon' | 'splash' | 'banner' | 'web-icon' | 'desktop-icon';

export type PresetDefinition = {
  label: string;
  width: number;
  height: number;
  aspectRatio: `${number}:${number}`;
  description: string;
};

export const PRESET_DEFINITIONS: Record<IconPreset, PresetDefinition> = {
  'app-store-icon': {
    label: 'App Store Icon',
    width: 1024,
    height: 1024,
    aspectRatio: '1:1',
    description: 'iOS App Store submission icon (1024x1024, 1:1)',
  },
  'play-store-icon': {
    label: 'Play Store Icon',
    width: 512,
    height: 512,
    aspectRatio: '1:1',
    description: 'Android Play Store listing icon (512x512, 1:1)',
  },
  'splash': {
    label: 'Splash Screen',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Android splash screen background (1080x1920, 9:16)',
  },
  'banner': {
    label: 'Play Store Banner',
    width: 1024,
    height: 500,
    aspectRatio: '16:9',
    description: 'Google Play Store feature graphic (1024x500, ~16:9)',
  },
  'web-icon': {
    label: 'Web Icon',
    width: 256,
    height: 256,
    aspectRatio: '1:1',
    description: 'Website favicon & web app icon (256x256, saves as .png and .ico)',
  },
  'desktop-icon': {
    label: 'Desktop Icon',
    width: 512,
    height: 512,
    aspectRatio: '1:1',
    description: 'Desktop application icon (512x512, saves as .png and .ico)',
  },
};

export type GatewayImageModelId =
  | 'xai/grok-imagine-image'
  | 'bytedance/seedream-4.0'
  | 'google/imagen-4.0-fast-generate-001'
  | 'recraft/recraft-v4.1';

export type ModelId = typeof MODELS[number]['id'];

export const MODELS = [
  { id: 'xai/grok-imagine-image', name: 'Grok Imagine', provider: 'xAI' },
  { id: 'bytedance/seedream-4.0', name: 'Seedream 4.0', provider: 'ByteDance' },
  { id: 'google/imagen-4.0-fast-generate-001', name: 'Imagen 4.0 Fast', provider: 'Google' },
  { id: 'recraft/recraft-v4.1', name: 'Recraft v4.1', provider: 'Recraft' },
] as const;

export type ConfigData = {
  gateway_api_key?: string;
  default_output_path?: string;
};

export const PRESET_KEYS: IconPreset[] = ['app-store-icon', 'play-store-icon', 'splash', 'banner', 'web-icon', 'desktop-icon'];

export interface GenerationOptions {
  model: ModelId;
  preset: IconPreset;
  prompt: string;
  isTransparent: boolean;
  rawPrompt: boolean;
  numImages: number;
}
