import { createGateway, generateImage } from 'ai';
import fs from 'fs-extra';
import path from 'path';
import pngToIco from 'png-to-ico';
import { ConfigService } from './config';
import { GenerationOptions, IconPreset, PRESET_DEFINITIONS } from '../types';
import { enhanceForIcon } from '../utils/prompts';

async function getKey(): Promise<string> {
  const apiKey = await ConfigService.get('gateway_api_key');
  if (!apiKey) {
    throw new Error('Gateway API key not configured.');
  }
  return apiKey;
}

async function getClient(){
  const apiKey = await getKey();
  return createGateway({ apiKey });
}

export const ImageService = {
  async generateIcon(options: GenerationOptions): Promise<string[]> {
    const gateway = await getClient();
    const model = gateway.imageModel(options.model);

    const presetDef = PRESET_DEFINITIONS[options.preset];
    const size = `${presetDef.width}x${presetDef.height}` as `${number}x${number}`;

    const finalPrompt =
      options.rawPrompt || options.isTransparent
        ? options.prompt
        : enhanceForIcon(options.prompt, options.preset, size);

    let generateResponse;
    try {
      generateResponse = await generateImage({
        model,
        prompt: finalPrompt,
        n: options.numImages,
        aspectRatio: presetDef.aspectRatio,
        size,
      });
    } catch (err: any) {
      // Reformat the error to be user-friendly rather than a raw SDK stack trace
      throw new Error(`AI generation failed: ${err.message || "Unknown error occurred"}`);
    }

    if (!generateResponse.images || generateResponse.images.length === 0) {
      throw new Error("AI provider returned no images.");
    }

    return generateResponse.images.map((i) => {
      if (!i.base64) throw new Error("AI provider returned an image without base64 data.");
      return i.base64;
    });
  },

  async saveImages(
    base64DataArray: string[],
    outputDir: string,
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
      
      // Save PNG
      const pngFilename = base64DataArray.length === 1
          ? `${label}-${timestamp}.png`
          : `${label}-${timestamp}-${i + 1}.png`;
      const pngPath = path.join(outputDir, pngFilename);
      await fs.writeFile(pngPath, buffer);
      outputPaths.push(pngPath);

      // Save ICO if it's a desktop or web icon
      if (isIcoPreset) {
        try {
          const icoBuffer = await pngToIco(buffer);
          const icoFilename = base64DataArray.length === 1
            ? `${label}-${timestamp}.ico`
            : `${label}-${timestamp}-${i + 1}.ico`;
          const icoPath = path.join(outputDir, icoFilename);
          await fs.writeFile(icoPath, icoBuffer);
          outputPaths.push(icoPath);
        } catch (err: any) {
          throw new Error(`Failed to generate .ico file: ${err.message}`);
        }
      }
    }

    return outputPaths;
  }
};
