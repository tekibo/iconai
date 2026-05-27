# 🎨 iconai

**The zero-dependency, AI-powered icon generator for mobile, web, and desktop apps.**

`iconai` is a terminal-based CLI that leverages cutting-edge AI models (xAI Grok, Google Imagen, ByteDance Seedream, Recraft) to generate production-ready application icons, favicons, and splash screens right from your command line.

No native dependencies, no C++ compilation (`node-gyp`), and no bloated post-install scripts. It's built in pure TypeScript and runs flawlessly on Node.js.

## ✨ Features

- 🚀 **Zero Native Dependencies:** Works instantly via `npx` without downloading precompiled binaries like Sharp or Canvas.
- 📱 **Smart Presets:** Automatically sizes and formats images for iOS, Android, Desktop, and Web.
- 🎯 **Prompt Engineering Engine:** You type a simple idea ("a cute robot"), and the CLI automatically injects lighting, stylization, and material parameters to make it look like a professional app icon.
- 🖼️ **Auto-Formatting:** 
  - **Mobile/Banner Presets:** Auto-saves as pristine `.png`.
  - **Desktop/Web Presets:** Auto-generates **both** a pristine `.png` and a multi-sized Windows `.ico` file automatically!

## 📦 Usage

You don't even need to install it. Just run it directly via `npx` or `pnpm dlx`!

```bash
npx iconai
# or
pnpm dlx iconai
```

### Initial Setup

On your first run, the CLI will ask for an **AI Gateway API Key**.
`iconai` uses the Vercel AI SDK to communicate with models. You will need a compatible API key (such as an OpenAI, Anthropic, or compatible gateway key) to generate images.

*(The key is securely stored locally in `~/.iconai/config.json`)*

## 🎮 How it Works

The CLI provides a gorgeous interactive terminal UI. 

1. **Select a Preset:**
   - App Store Icon (1024x1024) -> `.png`
   - Play Store Icon (512x512) -> `.png`
   - Web Icon (256x256) -> `.png` + `.ico`
   - Desktop Icon (512x512) -> `.png` + `.ico`
   - Splash Screen (1080x1920) -> `.png`
   - Play Store Banner (1024x500) -> `.png`
2. **Select a Model:** Choose from Grok, Imagen 4.0, Seedream, or Recraft.
3. **Set Image Count:** Generate up to 10 variations at once.
4. **Type a Prompt:** Describe your icon (e.g., "A minimalist geometric fox").
5. **Generate:** The CLI streams the generation and automatically saves the perfectly sized and formatted files to the `./assets` directory in your current folder!

## 🛠️ Development

Want to contribute or hack on `iconai` locally?

```bash
git clone https://github.com/tekibo/iconai.git
cd iconai

# Install dependencies
bun install

# Run the interactive dev environment
bun run dev

# Run the test suite (100% coverage!)
bun test --coverage

# Build the distributable Node.js package
bun run build
```

## 📝 License

MIT © Tekibo
