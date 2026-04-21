import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950 text-slate-100 px-4">
        <div className="max-w-lg w-full bg-ink-900 border border-red-700 rounded-lg p-6">
          <h1 className="font-display text-2xl text-accent-gold">Something broke</h1>
          <p className="text-sm text-slate-300 mt-2">
            The app hit an unexpected error. Your characters are safe — they're stored in this
            browser. Try reloading the page.
          </p>
          <pre className="mt-4 text-xs bg-ink-800 border border-ink-700 rounded p-3 text-red-300 overflow-auto max-h-40">
            {this.state.error.message}
          </pre>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm rounded bg-accent-gold text-ink-900 font-display font-bold hover:bg-yellow-300"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.reset}
              className="px-4 py-2 text-sm rounded border border-ink-600 text-slate-300 hover:bg-ink-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }
}
