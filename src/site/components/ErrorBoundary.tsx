import React from 'react';

type Props = { children: React.ReactNode };

export class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log safe: pass objects as additional args to avoid implicit coercion
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600 bg-white text-black">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="mt-2">An error occurred while rendering the site. Check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
