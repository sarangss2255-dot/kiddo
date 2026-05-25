export const theme = {
  fonts: {
    base: '"Inter", ui-sans-serif, system-ui, sans-serif',
    kids: '"Fredoka", cursive',
  },
  colors: {
    text: '#1C2340',
    textMuted: '#5F6787',
    textSoft: '#9EA4BC',
    brand: '#FF7A59',
    primaryDark: '#1C2340',
    surface: '#FFFFFF',
    surfaceStrong: '#FCFBF8',
    border: 'rgba(28, 35, 64, 0.05)',
    dark: '#1C2340',
    darkAlt: '#0F172A',
    white: '#FFFFFF',
  },
  gradients: {
    appBackground: '#FCFBF8',
    loginBackground: 'radial-gradient(circle at top left, rgba(255, 122, 89, 0.1), transparent 30%), #FCFBF8',
    heroPrimary: 'linear-gradient(135deg, #1C2340, #2C365E)',
    adminCallout: 'linear-gradient(135deg, #FF7A59, #FF9B82)',
  },
  shadows: {
    card: '0 10px 30px rgba(28, 35, 64, 0.04)',
  },
} as const;

export function applyTheme() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-base', theme.fonts.base);
  root.style.setProperty('--font-kids', theme.fonts.kids);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-text-soft', theme.colors.textSoft);
  root.style.setProperty('--color-brand', theme.colors.brand);
  root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-surface-strong', theme.colors.surfaceStrong);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-dark', theme.colors.dark);
  root.style.setProperty('--color-dark-alt', theme.colors.darkAlt);
  root.style.setProperty('--color-white', theme.colors.white);
  root.style.setProperty('--gradient-app-background', theme.gradients.appBackground);
  root.style.setProperty('--gradient-login-background', theme.gradients.loginBackground);
  root.style.setProperty('--gradient-hero-primary', theme.gradients.heroPrimary);
  root.style.setProperty('--gradient-admin-callout', theme.gradients.adminCallout);
  root.style.setProperty('--shadow-card', theme.shadows.card);
}
