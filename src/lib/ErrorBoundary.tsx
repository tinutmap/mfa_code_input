import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log({ error, info });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>{`Sorry, something's wrong. Please check console`}</div>;
    }

    return this.props.children;
  }
}
