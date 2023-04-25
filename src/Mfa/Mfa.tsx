import React, { FC, useEffect, useState, Dispatch } from 'react';
import { ResponseStatus, useAsync } from '../lib/useAsync';
import { submitMfaCode, sendMfaCode } from './Mfa.query';
import './Mfa.css';
import { MfaTiles } from './MfaTiles';

type MfaProps = {
  length: number;
  setDoRefetchMfaStatus: Dispatch<React.SetStateAction<boolean>>;
};
export const Mfa: FC<MfaProps> = ({ length, setDoRefetchMfaStatus }) => {
  const [timerInSeconds, setTimerInSeconds] = useState(-1); // NOTE: timer set to -1 denotes timer hasn't been set, to differentiate from timer === 0 which means it has expired
  useEffect(() => {
    let reduceTimer: NodeJS.Timer;
    if (timerInSeconds > 0) {
      reduceTimer = setInterval(
        () => setTimerInSeconds((time) => time - 1),
        1000
      );
    }
    return () => clearInterval(reduceTimer);
  }, [timerInSeconds]);

  const [code, setCode] = useState(Array.from({ length: length }, () => ''));

  const { data, status } = useAsync(sendMfaCode, []);

  const [errorMessage, setErrorMessage] = useState('');
  const [isCodeSubmittedFirstTime, setIsCodeSubmittedFirstTime] =
    useState(false);

  useEffect(() => {
    // NOTE: remove error message when input changes after wrong code's input
    setErrorMessage('');

    // NOTE: submit code first time after code is filled up to required length
    if (code.join('').length === length && !isCodeSubmittedFirstTime) {
      submitMfaCodeCallBack();
    }
  }, [code]);

  const submitMfaCodeCallBack = async () => {
    setIsCodeSubmittedFirstTime(true);
    if (await submitMfaCode(code.join(''))) {
      setDoRefetchMfaStatus((state) => !state);
    } else {
      setErrorMessage('Wrong Code');
    }
  };

  switch (status) {
    case ResponseStatus.Pending: {
      return <p>Loading...</p>;
    }
    case ResponseStatus.Reject: {
      return <p>Error {data.toString()}</p>;
    }
    case ResponseStatus.Resolved: {
      if (timerInSeconds === -1) {
        setTimerInSeconds(data.timerDurationInMillisecond / 1000);
      }
      return (
        <>
          <MfaTiles code={code} setCode={setCode} />
          {isCodeSubmittedFirstTime && (
            <div>
              <button onClick={async () => await submitMfaCodeCallBack()}>
                Submit MFA Code
              </button>
            </div>
          )}
          {errorMessage && <div>{errorMessage}</div>}
          {timerInSeconds > 0 ? (
            <p>Request new code in {timerInSeconds} second(s)</p>
          ) : (
            <div>
              <a
                role="button"
                onClick={async () => {
                  setTimerInSeconds(-1);
                  await sendMfaCode();
                }}
              >
                Resend Code
              </a>
            </div>
          )}
        </>
      );
    }
  }
};
