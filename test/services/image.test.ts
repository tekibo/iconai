import { expect, test, describe, beforeEach, afterEach, mock } from "bun:test";
import { Buffer } from "node:buffer";
import fs from "fs-extra";
import path from "path";
import os from "os";

import { MockProviderV3, MockImageModelV3 } from "ai/test";

// We mock ai, fs-extra, config and imageProcessor
let savedApiConfig: { apiKey?: string } | null = null;
let savedGenerateConfig: { prompt: string, model: string } | null = null;
let mockKey: string | null = "test-key";
let sampleBase64 = "";
let mockImageBehavior: "success" | "rate_limit" | "empty_response" | "missing_base64" = "success";

const mockImageModel = new MockImageModelV3({
  doGenerate: async ({ prompt }) => {
    if (mockImageBehavior === "rate_limit") {
      const err: any = new Error("Too many requests");
      err.name = "APICallError";
      err.statusCode = 429;
      throw err;
    }
    if (mockImageBehavior === "empty_response") {
      return {
        images: [],
        warnings: [],
        response: { id: "mock-id", timestamp: new Date(), modelId: "test-model", headers: undefined }
      };
    }
    if (mockImageBehavior === "missing_base64") {
      return {
        images: [""], // Mock SDK will map this to empty base64
        warnings: [],
        response: { id: "mock-id", timestamp: new Date(), modelId: "test-model", headers: undefined }
      };
    }
    
    savedGenerateConfig = { prompt: prompt as string, model: "mocked-model-xai/grok-imagine-image" }; // keep asserts happy
    return {
      images: [sampleBase64],
      warnings: [],
      response: { id: "mock-id", timestamp: new Date(), modelId: "test-model", headers: undefined }
    };
  }
});

mock.module("ai", () => {
  const original = import.meta.require("ai");
  return {
    ...original,
    createGateway: (config: { apiKey?: string }) => {
      savedApiConfig = config;
      return new MockProviderV3({
        imageModels: {
          "xai/grok-imagine-image": mockImageModel
        }
      });
    }
  };
});

mock.module("../../src/services/config", () => {
  return {
    ConfigService: {
      get: async (key: string) => {
        if (key === "gateway_api_key") return mockKey;
        return null;
      }
    }
  };
});

// Import after mocks
import { ImageService } from "../../src/services/image";
import { GenerationOptions } from "../../src/types";

describe("Image Service", () => {
  beforeEach(async () => {
    savedApiConfig = null;
    savedGenerateConfig = null;
    mockKey = "test-key";
    mockImageBehavior = "success";
    if (!sampleBase64) {
      const p = path.join(process.cwd(), "test", "assets", "sample.png");
      const fsPromises = require("node:fs/promises");
      const buf = await fsPromises.readFile(p);
      sampleBase64 = buf.toString("base64");
    }
  });

  afterEach(() => {
    mock.restore();
  });

  describe("generateIcon", () => {
    test("throws if API key is not configured", async () => {
      mockKey = null;
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "test",
        isTransparent: false,
        rawPrompt: false,
        numImages: 1
      };
      expect(ImageService.generateIcon(opts)).rejects.toThrow("Gateway API key not configured.");
    });

    test("calls generateImage with enhanced prompt for normal generation", async () => {
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "cat",
        isTransparent: false,
        rawPrompt: false,
        numImages: 1
      };
      
      const res = await ImageService.generateIcon(opts);
      
      expect(savedApiConfig!.apiKey).toBe("test-key");
      expect(savedGenerateConfig!.model).toBe("mocked-model-xai/grok-imagine-image");
      expect(savedGenerateConfig!.prompt).toContain("cat");
      expect(savedGenerateConfig!.prompt).toContain("web-app icon"); // Enhanced part
      expect(res.length).toBe(1);
    });

    test("calls generateImage with raw prompt if rawPrompt or isTransparent is true", async () => {
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "raw cat",
        isTransparent: true,
        rawPrompt: true,
        numImages: 1
      };
      
      await ImageService.generateIcon(opts);
      expect(savedGenerateConfig!.prompt).toBe("raw cat");
    });

    test("reformats AI rate limit errors gracefully", async () => {
      mockImageBehavior = "rate_limit";
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "test",
        isTransparent: false,
        rawPrompt: false,
        numImages: 1
      };
      
      expect(ImageService.generateIcon(opts)).rejects.toThrow("AI generation failed: Too many requests");
    });

    test("throws if API returns empty image list", async () => {
      mockImageBehavior = "empty_response";
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "test",
        isTransparent: false,
        rawPrompt: false,
        numImages: 1
      };
      
      expect(ImageService.generateIcon(opts)).rejects.toThrow("AI generation failed: No image generated.");
    });

    test("throws if API returns images missing base64 data", async () => {
      mockImageBehavior = "missing_base64";
      const opts: GenerationOptions = {
        model: "xai/grok-imagine-image",
        preset: "web-icon",
        prompt: "test",
        isTransparent: false,
        rawPrompt: false,
        numImages: 1
      };
      
      expect(ImageService.generateIcon(opts)).rejects.toThrow("AI provider returned an image without base64 data.");
    });
  });

  describe('saveImages', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = path.join(os.tmpdir(), `iconai-test-${Date.now()}`);
      await fs.ensureDir(tempDir);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    test('saves only png for non-ico presets', async () => {
      const base64Data = Buffer.from('fake image data').toString('base64');
      const paths = await ImageService.saveImages([base64Data], tempDir, 'app-store-icon');

      expect(paths).toHaveLength(1);
      expect(paths[0]).toMatch(/app-store-icon-\d+\.png$/);

      const exists = await fs.pathExists(paths[0]);
      expect(exists).toBe(true);
    });

    test('saves both png and ico for desktop-icon preset', async () => {
      // png-to-ico requires a valid png to not throw, or we mock it.
      // Wait, we don't mock png-to-ico, but maybe we should if we provide invalid png data?
      // For this test, let's mock pngToIco just for this file, or we provide a tiny valid PNG buffer.
      // A tiny valid 1x1 PNG base64:
      const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

      const paths = await ImageService.saveImages([tinyPngBase64], tempDir, 'desktop-icon');

      expect(paths).toHaveLength(2);
      expect(paths[0]).toMatch(/desktop-icon-\d+\.png$/);
      expect(paths[1]).toMatch(/desktop-icon-\d+\.ico$/);

      const pngExists = await fs.pathExists(paths[0]);
      const icoExists = await fs.pathExists(paths[1]);
      expect(pngExists).toBe(true);
      expect(icoExists).toBe(true);
    });

    test('saves multiple images with indexed suffixes', async () => {
      const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const paths = await ImageService.saveImages([tinyPngBase64, tinyPngBase64], tempDir, 'app-store-icon');

      expect(paths).toHaveLength(2);
      expect(paths[0]).toMatch(/app-store-icon-\d+-1\.png$/);
      expect(paths[1]).toMatch(/app-store-icon-\d+-2\.png$/);

      expect(await fs.pathExists(paths[0])).toBe(true);
      expect(await fs.pathExists(paths[1])).toBe(true);
    });
  });
});
