import fs from 'fs-extra';
import path from 'path';
import { OutputFormat } from '../types';

export async function loadImage(inputPath: string): Promise<Buffer> {
  const resolved = path.resolve(inputPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  return fs.readFile(resolved);
}

export async function removeBg(buffer: Buffer): Promise<Buffer> {
  const { removeBackground } = await import('@imgly/background-removal-node');
  const distRoot = new URL('../node_modules/@imgly/background-removal-node/dist/', import.meta.url).href;
  const result = await removeBackground(buffer, { publicPath: distRoot });
  return Buffer.from(await result.arrayBuffer());
}

export async function convertFormat(
  buffer: Buffer,
  format: OutputFormat,
  quality?: number,
): Promise<Buffer> {
  if (format === 'ico') {
    const sharp = (await import('sharp')).default;
    const pngToIco = (await import('png-to-ico')).default;
    const sizes = [16, 32, 48, 256];
    const resized = await Promise.all(
      sizes.map((s) => sharp(buffer).resize(s, s).png().toBuffer()),
    );
    return pngToIco(resized);
  }
  const sharp = (await import('sharp')).default;
  const opts: any = {};
  if ((format === 'jpeg' || format === 'webp') && quality) {
    opts.quality = quality;
  }
  return sharp(buffer).toFormat(format, opts).toBuffer();
}

export async function resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  return sharp(buffer).resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
}

export async function toIco(buffer: Buffer, sizes: number[]): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  const pngToIco = (await import('png-to-ico')).default;
  const resized = await Promise.all(
    sizes.map((s) => sharp(buffer).resize(s, s).png().toBuffer()),
  );
  return pngToIco(resized);
}

export async function processToolPipeline(
  inputPath: string,
  outputDir: string,
  opts: { removeBg: boolean; outputFormat: OutputFormat; quality: number; resizeWidth?: number; resizeHeight?: number },
): Promise<string[]> {
  try {
    await fs.ensureDir(outputDir);
    let buffer = await loadImage(inputPath);

    if (opts.removeBg) {
      buffer = await removeBg(buffer);
    }

    if (opts.resizeWidth && opts.resizeHeight) {
      buffer = await resize(buffer, opts.resizeWidth, opts.resizeHeight);
    }

    buffer = await convertFormat(buffer, opts.outputFormat, opts.quality);

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const ext = opts.outputFormat === 'jpeg' ? 'jpg' : opts.outputFormat;
    const outPath = path.join(outputDir, `${baseName}-processed.${ext}`);
    await fs.writeFile(outPath, buffer);

    return [outPath];
  } catch (e: any) {
    if (e.message?.startsWith('File not found:')) throw e;
    if (e.message?.includes('Unsupported format') || e.message?.includes('unsupported image')) {
      throw new Error(`Cannot decode image at "${path.resolve(inputPath)}". The file may be corrupted or not a valid image.`);
    }
    throw e;
  }
}
