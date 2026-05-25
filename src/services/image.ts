import { createGateway, generateImage } from 'ai';
import fs from 'fs-extra';
import path from 'path';
import { ConfigService } from './config';
import { GenerationOptions, IconPreset, OutputFormat, PRESET_DEFINITIONS } from '../types';
import { enhanceForIcon } from '../utils/prompts';
import { extFromFormat, icoSizes } from '../utils/imageTools';
import { convertFormat, toIco } from './imageProcessor';

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
    outputFormat: OutputFormat,
    preset: IconPreset
  ): Promise<string[]> {
    const outputPaths: string[] = [];
    const timestamp = Date.now();
    await fs.ensureDir(outputDir);
    const def = PRESET_DEFINITIONS[preset];

    const label = def.label
      .toLowerCase()
      .replace(/\s+/g, '-');

    for (let i = 0; i < base64DataArray.length; i++) {
      const buffer = Buffer.from(base64DataArray[i], 'base64');
      const isIcoPreset = preset === 'web-icon' || preset === 'desktop-icon';
      const output = outputFormat === 'ico'
        ? await toIco(buffer, isIcoPreset ? icoSizes(preset) : [16, 32, 48, 256])
        : await convertFormat(buffer, outputFormat, 85);
      const ext = extFromFormat(outputFormat);
      const filename =
        base64DataArray.length === 1
          ? `${label}-${timestamp}.${ext}`
          : `${label}-${timestamp}-${i + 1}.${ext}`;
      const outputPath = path.join(outputDir, filename);
      await fs.writeFile(outputPath, output);
      outputPaths.push(outputPath);
    }

    return outputPaths;
  }
}
