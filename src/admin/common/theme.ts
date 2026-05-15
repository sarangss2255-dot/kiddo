export const theme = {
  fonts: {
    base: '"Trebuchet MS", "Avenir Next", sans-serif',
  },
  colors: {
    text: '#10243b',
    textMuted: '#6e8094',
    textSoft: '#4b5563',
    brand: '#9a3412',
    primaryDark: '#0f62d6',
    surface: 'rgba(255, 255, 255, 0.92)',
    surfaceStrong: 'rgba(255, 255, 255, 0.78)',
    border: 'rgba(16, 36, 59, 0.08)',
    dark: '#0e1f33',
    darkAlt: '#0f172a',
    white: '#ffffff',
  },
  gradients: {
    appBackground:
      'radial-gradient(circle at top left, rgba(255, 195, 0, 0.18), transparent 24%), radial-gradient(circle at top right, rgba(23, 130, 255, 0.16), transparent 28%), linear-gradient(180deg, #fffaf0 0%, #eff7ff 48%, #eefbf2 100%)',
    loginBackground:
      'radial-gradient(circle at top left, rgba(40, 134, 255, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(22, 163, 74, 0.15), transparent 35%), #f7fbff',
    heroPrimary: 'linear-gradient(135deg, #ef6c00, #f59e0b)',
    adminCallout: 'linear-gradient(135deg, #10243b, #1d4e89)',
  },
  shadows: {
    card: '0 20px 60px rgba(16, 36, 59, 0.08)',
  },
} as const;

export function applyTheme() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-base', theme.fonts.base);
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
