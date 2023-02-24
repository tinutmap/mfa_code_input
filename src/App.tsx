import React, {useState, useEffect } from 'react';
import './App.css';
export const appHeader = 'Simple MFA Input with Countdown Timer'
function App() {
  const [timer, setTimer] = useState(30)
  useEffect(()=>{
    let reduceTimer: NodeJS.Timer
    if (timer > 0)    {
      reduceTimer = setInterval(()=>setTimer(time => time - 1),1000)
    }
    return ()=> clearInterval(reduceTimer)
  },[timer])
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {appHeader}
        </p>
        <p>
          Timer {timer} second(s)
        </p>
      </header>
    </div>
  );
}

export default App;
