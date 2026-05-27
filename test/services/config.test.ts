import { expect, test, describe, beforeEach, afterEach, mock, spyOn } from "bun:test";
import path from "path";
import os from "os";
import fs from "fs-extra";

const tempHome = path.join(os.tmpdir(), `iconai-test-home-${Date.now()}`);

// We use process.env to override os.homedir() which ConfigService reads at load time
const originalHome = process.env.HOME;
const originalUserProfile = process.env.USERPROFILE;
process.env.HOME = tempHome;
process.env.USERPROFILE = tempHome;

const { ConfigService } = await import("../../src/services/config");

const expectedConfigPath = path.join(tempHome, ".iconai", "config.json");

describe("Config Service", () => {
  beforeEach(async () => {
    await fs.emptyDir(tempHome);
    await fs.ensureFile(expectedConfigPath);
    await fs.writeJSON(expectedConfigPath, { gateway_api_key: "initial_key" });
  });

  afterEach(async () => {
    await fs.remove(tempHome);
    process.env.HOME = originalHome;
    process.env.USERPROFILE = originalUserProfile;
    mock.restore();
  });

  describe("getConfig", () => {
    test("returns parsed config when file exists", async () => {
      const config = await ConfigService.getConfig();
      expect(config).toEqual({ gateway_api_key: "initial_key" });
    });

    test("returns empty object and initializes file when file does not exist", async () => {
      await fs.remove(expectedConfigPath); // simulate no file
      const config = await ConfigService.getConfig();
      expect(config).toEqual({});
      const contents = await fs.readFile(expectedConfigPath, "utf-8");
      expect(contents.trim()).toBe("{}");
    });

    test("returns empty object and warns when JSON is corrupted", async () => {
      await fs.writeFile(expectedConfigPath, "{ corrupted json: ");
      const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});
      const config = await ConfigService.getConfig();
      expect(config).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test("throws error on critical filesystem errors like permissions", async () => {
      const readSpy = spyOn(fs, "readJSON").mockRejectedValue(new Error("EACCES: permission denied"));
      expect(ConfigService.getConfig()).rejects.toThrow("EACCES: permission denied");
      readSpy.mockRestore();
    });
  });

  describe("setConfig", () => {
    test("merges updates into existing config", async () => {
      await ConfigService.setConfig({ gateway_api_key: "web-icon" });
      const updated = await ConfigService.getConfig();
      expect(updated).toEqual({ gateway_api_key: "web-icon" });
    });
  });

  describe("get", () => {
    test("returns specific key value", async () => {
      const val = await ConfigService.get("gateway_api_key");
      expect(val).toBe("initial_key");
    });
  });

  describe("set", () => {
    test("updates a specific key value", async () => {
      await ConfigService.set("gateway_api_key", "new_key");
      const val = await ConfigService.get("gateway_api_key");
      expect(val).toBe("new_key");
    });
  });
});
