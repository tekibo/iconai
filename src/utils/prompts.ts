import type { IconPreset } from '../types';

export function enhanceForIcon(userPrompt: string, preset: IconPreset, size: string): string {
  switch (preset) {
    case 'app-store-icon':
      return `Create a ${size} square iOS app-icon illustration: ${userPrompt}. Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. No text, borders, or extraneous details. Final look: clean, vibrant, and Apple-polished. Use the full image size for the icon, don't draw it inside the image, don't add borders, the rounded corners would be applied by the platform, so don't add them.`;
    case 'play-store-icon':
      return `Create a ${size} square Android app-icon illustration: ${userPrompt}. Use material design principles with bold, vibrant colors and clean geometry. Subtle depth with appropriate shadowing. Center the design with comfortable margins. Solid background or subtle gradient. No text, borders, or extraneous details. Final look should be modern, bold, and Android-appropriate. Use the full image size for the icon.`;
    case 'splash':
      return `Create a ${size} full-screen splash background image: ${userPrompt}. Use a smooth gradient or subtle pattern that fills the entire canvas. Design should be immersive and atmospheric, suitable as a launch screen background. Keep the center area clear for the app icon overlay. No text, borders, or rounded corners.`;
    case 'banner':
      return `Create a ${size} wide-format Google Play Store feature graphic: ${userPrompt}. Design should be eye-catching and promotional, with vibrant colors and clear visual hierarchy. Keep important elements within the center safe area. Use the full canvas width. No text, borders, or rounded corners.`;
    case 'web-icon':
      return `Create a ${size} square web-app icon: ${userPrompt}. Clean, flat design with modern aesthetics. Use a solid background that works well at small sizes. Center the subject clearly. No text, borders, or rounded corners. High contrast for small display. Final look: crisp, recognizable, and web-appropriate.`;
    case 'desktop-icon':
      return `Create a ${size} square desktop application icon: ${userPrompt}. Professional, polished design suitable for Windows/macOS. Use rich colors with appropriate depth and dimension. Center the subject with some padding. Subtle shadowing for depth. No text, borders, or rounded corners. Final look: premium, clean, and desktop-ready.`;
  }
}

export function getSuccessfulPromptElements(): string[] {
  return [
    "crisp, minimal design",
    "vibrant colors with subtle inner bevel",
    "comfortable breathing room from edges",
    "solid, light-neutral background",
    "clean, vibrant, and Apple-polished",
    "no text, borders, or extraneous details",
    "use full image size for the icon",
    "don't draw it inside the image",
    "rounded corners applied by platform"
  ];
}

export function getPopularExamples(): string[] {
  return [
    "crisp, minimal, glass-like color-wheel flower made of eight evenly spaced, semi-transparent petals forming a perfect circle",
    "minimalist calculator app with clean geometric numbers and soft gradients",
    "fitness tracker app with stylized running figure using vibrant gradient colors",
    "weather app with glass-like sun and translucent cloud elements",
    "music player app with abstract sound waves in soft pastel hues",
    "photo gallery app with camera lens design using inner bevel effects",
    "messaging app with speech bubble in vibrant, translucent style",
    "calendar app with clean date grid and subtle depth",
    "note-taking app with pen and paper using soft, blended colors",
    "banking app with secure lock symbol and professional gradients"
  ];
}

export function addGlassEffects(prompt: string): string {
  return `${prompt} with glass-like, semi-transparent elements and soft color blending where elements overlap`;
}

export function addPastelColors(prompt: string): string {
  return `${prompt} using soft pastel hues (pink, orange, yellow, green, teal, blue, indigo, violet)`;
}
