import React from 'react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicLandingPage } from '../site/pages/PublicLandingPage';
import { AuthPage } from '../site/pages/app/AuthPage';
import { DownloadPage } from '../site/pages/DownloadPage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href: typeof href === 'string' ? href : '#', ...props }, children),
}));

beforeAll(() => {
  // jsdom does not implement IntersectionObserver (used by framer-motion)
  if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
    // @ts-expect-error test-only stub
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }
  // stub scroll behavior used by the navbar
  if (typeof window !== 'undefined' && !('scrollY' in window)) {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  }
});

describe('PublicLandingPage', () => {
  it('renders all key sections without crashing', () => {
    render(<PublicLandingPage />);

    expect(screen.getAllByText(/Good Habits Today/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Great Kids Tomorrow/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Get the App').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Log in').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Download the App').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/See how it works/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/One place for/i)).toBeTruthy();
    expect(screen.getByText(/Everything your child needs to grow/i)).toBeTruthy();
    expect(screen.getByText(/How KidDo Works/i)).toBeTruthy();
    expect(screen.getByText(/See KidDo in action/i)).toBeTruthy();
    expect(screen.getByText(/Know what matters/i)).toBeTruthy();
    expect(screen.getByText('Download the Parent App')).toBeTruthy();
    expect(screen.getByText(/closer together/i)).toBeTruthy();
    expect(screen.getByText(/an adventure/i)).toBeTruthy();
    expect(screen.getByText('Download the Child App')).toBeTruthy();
    expect(screen.getByText(/kids' safety in mind/i)).toBeTruthy();
    expect(screen.getByText(/How kids grow with KidDo/i)).toBeTruthy();
    expect(screen.getByText(/What families are saying/i)).toBeTruthy();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeTruthy();
    expect(screen.getByText(/Make every day a little more meaningful/i)).toBeTruthy();
    expect(screen.getByText(/© 2026 KidDo/i)).toBeTruthy();
  });

  it('renders the real phone dashboard UI inside the hero', () => {
    render(<PublicLandingPage />);

    // The dashboard appears in the hero, child section and app preview
    expect(screen.getAllByText(/Hey there, Emma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ready for today's adventure/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Daily Mission/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/My Missions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rewards Shop/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Profile/i).length).toBeGreaterThan(0);
  });

  it('renders the login screen', () => {
    render(<AuthPage />);

    expect(screen.getByText('Log in to KidDo')).toBeTruthy();
    expect(screen.getByText(/an adventure/i)).toBeTruthy();
    expect(screen.getByText('Continue with Google')).toBeTruthy();
    expect(screen.getByPlaceholderText('name@family.com')).toBeTruthy();
    expect(screen.getByText(/magic code/i)).toBeTruthy();
    expect(screen.getByText('Create a family account')).toBeTruthy();
    expect(screen.getByText(/Back to home/i)).toBeTruthy();
    // Real KidDo dashboard rendered on the brand side
    expect(screen.getAllByText(/Daily Mission/i).length).toBeGreaterThan(0);
  });

  it('renders the download page with both app downloads', () => {
    render(<DownloadPage />);

    expect(screen.getByText(/Get the KidDo app/i)).toBeTruthy();
    expect(screen.getByText('Download Child App')).toBeTruthy();
    expect(screen.getByText('Download Parent App')).toBeTruthy();
    expect(screen.getByText(/iOS — coming soon/i)).toBeTruthy();
    expect(screen.getByText(/Scan to install/i)).toBeTruthy();
  });
});
