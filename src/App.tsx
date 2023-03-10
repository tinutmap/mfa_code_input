import React from 'react';
import './App.css';
import { MfaWrapper } from './Mfa/Mfa';
export const appHeader = 'Simple MFA Input with Countdown Timer';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>{appHeader}</p>
        <div>
          <MfaWrapper>
            <div>Child Component</div>
          </MfaWrapper>
        </div>
      </header>
    </div>
  );
}

export default App;
