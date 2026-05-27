import { expect, test, describe } from "bun:test";
import { validatePrompt, validateApiKey, validateOutputPath, maskApiKey } from "../../src/utils/validation";

describe("Validation Utils", () => {
  describe("validatePrompt", () => {
    test("returns error for empty prompt", () => {
      expect(validatePrompt("")).toBe("Prompt cannot be empty");
      expect(validatePrompt("   ")).toBe("Prompt cannot be empty");
    });

    test("returns error for prompt over 1000 characters", () => {
      const longPrompt = "a".repeat(1001);
      expect(validatePrompt(longPrompt)).toBe("Prompt too long (max 1000 characters)");
    });

    test("returns null for valid prompt", () => {
      expect(validatePrompt("valid prompt")).toBeNull();
    });
  });

  describe("validateApiKey", () => {
    test("returns error for empty api key", () => {
      expect(validateApiKey("")).toBe("API key cannot be empty");
      expect(validateApiKey("   ")).toBe("API key cannot be empty");
    });

    test("returns null for valid api key", () => {
      expect(validateApiKey("valid-api-key")).toBeNull();
    });
  });

  describe("validateOutputPath", () => {
    test("returns error for empty output path", () => {
      expect(validateOutputPath("")).toBe("Output path cannot be empty");
      expect(validateOutputPath("   ")).toBe("Output path cannot be empty");
    });

    test("returns null for valid output path", () => {
      expect(validateOutputPath("./out")).toBeNull();
    });
  });

  describe("maskApiKey", () => {
    test("returns empty string for empty key", () => {
      expect(maskApiKey("")).toBe("");
    });

    test("masks short keys entirely", () => {
      expect(maskApiKey("12345678")).toBe("••••••••");
      expect(maskApiKey("1234")).toBe("••••");
    });

    test("masks long keys leaving first 4 and last 4 characters", () => {
      expect(maskApiKey("1234-some-secret-key-5678")).toBe("1234…5678");
    });
  });
});
