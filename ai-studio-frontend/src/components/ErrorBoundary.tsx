import React from 'react';

type State = { hasError: boolean };

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {}

  reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="border border-border rounded p-4 bg-white dark:bg-dark">
            <div className="text-lg font-semibold text-secondary dark:text-text-light">Something went wrong</div>
            <div className="mt-2 text-sm text-text-muted">Please retry.</div>
            <button className="mt-3 px-3 py-1 rounded bg-primary hover:bg-primary-glow text-black font-medium transition-colors" onClick={this.reset}>Retry</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
