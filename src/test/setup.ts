import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-native', async () => {
  const reactNativeWeb = await import('react-native-web');
  return {
    ...reactNativeWeb,
    Alert: {
      alert: vi.fn(),
    },
    Platform: {
      OS: 'web',
      select: (options: Record<string, unknown>) => options.web ?? options.default,
    },
  };
});

vi.mock('lucide-react-native', async () => import('lucide-react'));
