import React from 'react';
import './App.css';
import { MfaWrapper } from './Mfa/Mfa';
import { ErrorBoundary } from './lib/ErrorBoundary';
import { MfaWrappedChildComponent } from './Mfa/MfaWrappedChildComponent';

export const appHeader = 'Simple MFA Input with Countdown Timer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>{appHeader}</p>
        <div>
          <ErrorBoundary>
            <MfaWrapper>
              <MfaWrappedChildComponent />
            </MfaWrapper>
          </ErrorBoundary>
        </div>
      </header>
    </div>
  );
}

export default App;
