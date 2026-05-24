<pre>
██╗ ██████╗ ██████╗ ███╗   ██╗ █████╗ ██╗
██║██╔════╝██╔═══██╗████╗  ██║██╔══██╗██║
██║██║     ██║   ██║██╔██╗ ██║███████║██║
██║██║     ██║   ██║██║╚██╗██║██╔══██╗██║
██║╚██████╗╚██████╔╝██║ ╚████║██║  ██║██║
╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝
</pre>

AI-powered icon generation and image processing, in your terminal.

---

## Quick start

```bash
npx iconai
pnpm dlx iconai
bunx iconai
```

Requires Node.js 18+.

---

## Flows

iconai has two modes: **AI generation** and **image tools**.

### AI generation

Press `c` to set your API key on first use, then enter a prompt to generate app icons, splash screens, banners and more. Press `t` at any time to switch to the tools flow.

| Key              | Action                       |
|------------------|------------------------------|
| `↑ ↓`            | Move between fields          |
| `Enter`          | Edit a field / generate      |
| `Esc`            | Cancel editing / go back     |
| `c`              | Configure API key            |
| `t`              | Switch to tools flow         |
| `q`              | Quit                         |

**Presets:**

| Preset              | Size       | Ratio   | Notes                   |
|---------------------|------------|---------|-------------------------|
| App Store Icon      | 1024×1024  | 1:1     | iOS App Store           |
| Play Store Icon     | 512×512    | 1:1     | Android Play Store      |
| Splash Screen       | 1080×1920  | 9:16    | Android splash          |
| Play Store Banner   | 1024×500   | 16:9    | Feature graphic         |
| Web Icon            | 256×256    | 1:1     | Also outputs `.ico`     |
| Desktop Icon        | 512×512    | 1:1     | Also outputs `.ico`     |

**Models:** Flux 2 Klein 9B, Grok Imagine, Seedream 4.0, Imagen 4.0 Fast, Recraft v4.1.

### Image tools

Press `t` from the generator to open the tools screen. Process existing images without needing an API key.

| Key              | Action                       |
|------------------|------------------------------|
| `↑ ↓`            | Move between fields          |
| `Enter`          | Edit a field / process       |
| `Esc`            | Cancel editing               |
| `b`              | Back to generator            |
| `q`              | Quit                         |

**Available tools:**

- **Background removal** — removes the background from an image.
- **Format conversion** — convert between PNG, JPEG and WebP formats.
- Output directory selection

---

## API key

Required only for AI generation. Stored locally at `~/.iconai/config.json`. Press `c` from the generator to set or update it.

---

## Development

```bash
pnpm install
pnpm run dev      # run from source via tsx
pnpm run build    # bundle with tsup → dist/index.js
```

---

## License

MIT
