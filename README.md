<pre>
██╗ ██████╗ ██████╗ ███╗   ██╗ █████╗ ██╗
██║██╔════╝██╔═══██╗████╗  ██║██╔══██╗██║
██║██║     ██║   ██║██╔██╗ ██║███████║██║
██║██║     ██║   ██║██║╚██╗██║██╔══██╗██║
██║╚██████╗╚██████╔╝██║ ╚████║██║  ██║██║
╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝
</pre>

AI-powered icon generation for mobile and web, in your terminal.

---

## Quick start

```bash
npx iconai
pnpm dlx iconai
bunx iconai
```

Requires Node.js 18+.

---

## Usage

Press `c` to set your API key on first use, then enter a prompt to generate icons, splash screens, banners and more.

| Key              | Action                       |
|------------------|------------------------------|
| `↑ ↓`            | Move between fields          |
| `→ ←`            | Change format / count        |
| `Enter`          | Edit a field / generate      |
| `Esc`            | Cancel editing               |
| `c`              | Configure API key            |
| `q`              | Quit                         |

### Presets

| Preset              | Size       | Ratio   | Default format | Notes                   |
|---------------------|------------|---------|----------------|-------------------------|
| App Store Icon      | 1024×1024  | 1:1     | PNG            | iOS App Store           |
| Play Store Icon     | 512×512    | 1:1     | PNG            | Android Play Store      |
| Splash Screen       | 1080×1920  | 9:16    | PNG            | Android splash          |
| Play Store Banner   | 1024×500   | 16:9    | PNG            | Feature graphic         |
| Web Icon            | 256×256    | 1:1     | ICO            | Favicon + web app icon  |
| Desktop Icon        | 512×512    | 1:1     | ICO            | Desktop application     |

The format automatically defaults to **ICO** for web and desktop presets, and **PNG** for everything else. You can override it with `← →` in the format field.

### Supported formats

PNG, JPEG, WebP, ICO.

### Supported Models

Grok Imagine, Seedream, Imagen, Recraft

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
