import { expect, test, describe } from "bun:test";
import { 
  enhanceForIcon, 
  getSuccessfulPromptElements, 
  getPopularExamples, 
  addGlassEffects, 
  addPastelColors 
} from "../../src/utils/prompts";
import { IconPreset } from "../../src/types";

describe("Prompts Utils", () => {
  describe("enhanceForIcon", () => {
    const testCases: { preset: IconPreset; expectedPhrase: string }[] = [
      { preset: "app-store-icon", expectedPhrase: "iOS app-icon" },
      { preset: "play-store-icon", expectedPhrase: "Android app-icon" },
      { preset: "splash", expectedPhrase: "full-screen splash background" },
      { preset: "banner", expectedPhrase: "Google Play Store feature graphic" },
      { preset: "web-icon", expectedPhrase: "web-app icon" },
      { preset: "desktop-icon", expectedPhrase: "desktop application icon" }
    ];

    testCases.forEach(({ preset, expectedPhrase }) => {
      test(`enhances prompt correctly for ${preset}`, () => {
        const result = enhanceForIcon("my prompt", preset, "1024x1024");
        expect(result).toContain("my prompt");
        expect(result).toContain("1024x1024");
        expect(result).toContain(expectedPhrase);
      });
    });
  });

  describe("getSuccessfulPromptElements", () => {
    test("returns array of strings", () => {
      const elements = getSuccessfulPromptElements();
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
      expect(typeof elements[0]).toBe("string");
    });
  });

  describe("getPopularExamples", () => {
    test("returns array of strings", () => {
      const examples = getPopularExamples();
      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
      expect(typeof examples[0]).toBe("string");
    });
  });

  describe("addGlassEffects", () => {
    test("appends glass effects to prompt", () => {
      const result = addGlassEffects("test prompt");
      expect(result).toBe("test prompt with glass-like, semi-transparent elements and soft color blending where elements overlap");
    });
  });

  describe("addPastelColors", () => {
    test("appends pastel colors to prompt", () => {
      const result = addPastelColors("test prompt");
      expect(result).toBe("test prompt using soft pastel hues (pink, orange, yellow, green, teal, blue, indigo, violet)");
    });
  });
});
