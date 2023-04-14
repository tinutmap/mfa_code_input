import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}
export class ErrorBoundary extends Component<Props, State> {
  //   constructor(props) {
  //     super(props);
  //     this.state = { hasError: false };
  //   }
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // logErrorToMyService(error, info.componentStack);
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
