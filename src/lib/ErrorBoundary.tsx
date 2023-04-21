import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  isMfaInvalid: boolean;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isMfaInvalid: false,
  };

  static getDerivedStateFromError(error: Error): State | undefined {
    // Update state so the next render will show the fallback UI.
    try {
      const message = JSON.parse(error.message);
      const mfaInvalid = message?.mfaInvalid;
      if (mfaInvalid) {
        return { isMfaInvalid: true, hasError: true };
      } else
        return {
          hasError: true,
          isMfaInvalid: false,
        };
    } catch (e) {
      console.log(e);
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log({ error, info });
  }

  render() {
    if (this.state.hasError && !this.state.isMfaInvalid) {
      // You can render any custom fallback UI
      return <div>{`Sorry, something's wrong. Please check console`}</div>;
    }

    return this.props.children;
  }
}
