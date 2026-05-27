import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { ConfigData } from '../types';

const configPath = path.join(os.homedir(), '.iconai', 'config.json');

export const ConfigService = {
  async getConfig(): Promise<ConfigData> {
    const exists = await fs.pathExists(configPath);
    if (!exists) {
      await fs.ensureDir(path.dirname(configPath));
      await fs.writeJSON(configPath, {}, { spaces: 2 });
      return {};
    }

    try {
      return await fs.readJSON(configPath);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        console.warn(`\n[WARNING] Configuration file at ${configPath} is corrupted. Returning empty config.`);
        return {};
      }
      throw error;
    }
  },

  async setConfig(updates: Partial<ConfigData>): Promise<void> {
    const current = await this.getConfig();
    const updated = { ...current, ...updates };
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJSON(configPath, updated, { spaces: 2 });
  },

  async get<K extends keyof ConfigData>(key: K): Promise<ConfigData[K]> {
    const config = await this.getConfig();
    return config[key];
  },

  async set<K extends keyof ConfigData>(key: K, value: ConfigData[K]): Promise<void> {
    await this.setConfig({ [key]: value } as Partial<ConfigData>);
  }
};