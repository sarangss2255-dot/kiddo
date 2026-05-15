import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from './pages/Login';

// Mock Firebase
vi.mock('./firebase', () => ({
  auth: {
    signOut: vi.fn(),
  },
  googleProvider: {},
}));

describe('Login Component', () => {
  it('renders the app title', () => {
    render(<Login />);
    expect(screen.getByText(/KidTasker/i)).toBeInTheDocument();
  });

  it('renders the sign in button', () => {
    render(<Login />);
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });
});
