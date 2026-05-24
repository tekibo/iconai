# Contributing

Thank you for your interest in contributing to iconai.

## Development

```bash
# install dependencies
pnpm install

# run in development mode
pnpm run dev

# build for production
pnpm run build
```

## Project structure

```
src/
  index.ts             # entry point
  types.ts             # shared types and preset definitions
  ink/                 # Ink React components (terminal UI)
    App.tsx            # screen router and orchestration
    constants.ts       # presets list and spinner characters
    components/        # reusable UI elements
      Header.tsx       # app branding header
      Spinner.tsx      # animated spinner
    screens/           # full-page views
      LoadingScreen.tsx
      ConfigScreen.tsx # API key input
      GeneratorScreen.tsx  # preset→prompt→count→confirm flow router
      GeneratingScreen.tsx  # generation progress
      DoneScreen.tsx   # success results
      ErrorScreen.tsx  # error display
    steps/             # sub-views used by GeneratorScreen
      PresetPicker.tsx # arrow-key preset selector
      PromptInput.tsx  # prompt text input
      CountPicker.tsx  # image count adjuster
      ConfirmView.tsx  # summary before generation
  services/
    config.ts          # persistent config (API key storage)
    image.ts           # image generation via Vercel AI SDK
  utils/
    validation.ts      # pure validation functions
    prompts.ts         # preset-specific prompt template functions
```

## Code style

- No comments in source code
- Extensionless relative imports in source files
- Components are presentational; state lives in App.tsx
- Each component manages its own keyboard input via `useInput`
