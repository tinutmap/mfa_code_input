import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [timer, setTimer] = React.useState(30)
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
          Timer {timer} second(s)
        </p>
      </header>
    </div>
  );
}

export default App;
