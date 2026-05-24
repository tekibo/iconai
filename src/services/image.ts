import { createGateway, generateImage } from 'ai';
import fs from 'fs-extra';
import path from 'path';
import { ConfigService } from './config';
import { GenerationOptions, IconPreset, PRESET_DEFINITIONS } from '../types';
import { enhanceForIcon } from '../utils/prompts';
import { icoSizes } from '../utils/imageTools';
import { toIco } from './imageProcessor';

export class ImageService {
  private static async key(): Promise<string> {
    const apiKey = await ConfigService.get('gateway_api_key');
    if (!apiKey) {
      throw new Error('Gateway API key not configured.');
    }
    return apiKey;
  }

  private static async getClient(){
    const apiKey = await this.key();
    return createGateway({ apiKey });
  }

  static async generateIcon(options: GenerationOptions): Promise<string[]> {
    const gateway = await this.getClient();
    const model = gateway.imageModel(options.model);

    const presetDef = PRESET_DEFINITIONS[options.preset];
    const size = `${presetDef.width}x${presetDef.height}` as `${number}x${number}`;

    const finalPrompt =
      options.rawPrompt || options.isTransparent
        ? options.prompt
        : enhanceForIcon(options.prompt, options.preset, size);

    const { images } = await generateImage({
      model,
      prompt: finalPrompt,
      n: options.numImages,
      aspectRatio: presetDef.aspectRatio,
      size,
    });

    return images.map((i) => i.base64);
  }

  static async saveImages(
    base64DataArray: string[],
    outputDir: string,
    outputFormat: string,
    preset: IconPreset
  ): Promise<string[]> {
    const outputPaths: string[] = [];
    const timestamp = Date.now();
    await fs.ensureDir(outputDir);

    const label = PRESET_DEFINITIONS[preset].label
      .toLowerCase()
      .replace(/\s+/g, '-');

    for (let i = 0; i < base64DataArray.length; i++) {
      const buffer = Buffer.from(base64DataArray[i], 'base64');
      const ext = detectFormat(buffer) || outputFormat || 'png';
      const filename =
        base64DataArray.length === 1
          ? `${label}-${timestamp}.${ext}`
          : `${label}-${timestamp}-${i + 1}.${ext}`;
      const outputPath = path.join(outputDir, filename);
      await fs.writeFile(outputPath, buffer);
      outputPaths.push(outputPath);
    }

    const def = PRESET_DEFINITIONS[preset];
    if (def.convertToIco && base64DataArray.length > 0) {
      const buffer = Buffer.from(base64DataArray[0], 'base64');
      const ico = await toIco(buffer, icoSizes(preset as 'web-icon' | 'desktop-icon'));
      const icoPath = path.join(outputDir, `${preset}-${timestamp}.ico`);
      await fs.writeFile(icoPath, ico);
      outputPaths.push(icoPath);
    }

    return outputPaths;
  }
}

function detectFormat(buffer: Buffer): string | null {
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'jpg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E) return 'png';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'webp';
  return null;
}
