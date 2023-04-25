import React, { FC, useEffect, useState, Dispatch } from 'react';
import { ResponseStatus, useAsync } from '../lib/useAsync';
import { submitMfaCode, sendMfaCode } from './Mfa.query';
import './Mfa.css';
import { MfaTiles } from './MfaTiles';

// const ALLOWED_KEY = Array.from({ length: 10 }, (_, i) => i.toString()).concat([
//   '',
// ]);

// type MfaCodeDigitTileProps = {
//   index: number;
//   digit: string;
//   setCode: Dispatch<React.SetStateAction<string[]>>;
//   isCurrentTile: boolean;
//   currentTileIndex: React.MutableRefObject<number>;
// };

// const MfaCodeDigitTile: FC<MfaCodeDigitTileProps> = ({
//   index,
//   digit,
//   setCode,
//   isCurrentTile,
//   currentTileIndex,
// }) => {
//   const updateCode = (value: string) => {
//     if (ALLOWED_KEY.includes(value)) {
//       setCode((code) => {
//         const newCode = code;
//         newCode[index] = value;
//         if (value !== '') {
//           currentTileIndex.current = index + 1;
//         }
//         return [...newCode];
//       });
//     }
//   };
//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       return console.log('Enter pressed');
//     }
//     if (event.key === 'Backspace' || event.key === 'Delete') {
//       if (digit) return;
//       if (!digit) {
//         event.preventDefault();
//         currentTileIndex.current = index - 1;
//         return;
//       }
//     }
//   };
//   const tileRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (tileRef.current && isCurrentTile) {
//       tileRef.current.focus();
//     }
//   }, [isCurrentTile]);

//   return (
//     <input
//       type="text"
//       minLength={1}
//       maxLength={1}
//       value={digit}
//       onChange={(e) => updateCode(e.target.value)}
//       onKeyDown={(event) => handleKeyDown(event)}
//       ref={tileRef}
//       className="mfa-tile"
//     />
//   );
// };

// type MfaTilesProps = {
//   code: string[];
//   setCode: Dispatch<React.SetStateAction<string[]>>;
// };
// const MfaTiles: FC<MfaTilesProps> = ({ code, setCode }) => {
//   const currentTileIndex = useRef(0);

//   return (
//     <>
//       {code.map((digit, index) => (
//         <MfaCodeDigitTile
//           key={index}
//           index={index}
//           digit={digit}
//           setCode={setCode}
//           isCurrentTile={currentTileIndex.current === index}
//           currentTileIndex={currentTileIndex}
//         />
//       ))}
//     </>
//   );
// };
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

// type MfaWrapperProps = {
//   children?: ReactNode;
// };

// export const setDoRefetchMfaStatusContext = createContext<
//   Dispatch<SetStateAction<boolean>>
// >(() => false);

// export const MfaWrapper: FC<MfaWrapperProps> = ({ children }): JSX.Element => {
//   const [doRefetchMfaStatus, setDoRefetchMfaStatus] = useState(false);
//   const { data, status } = useAsync<MfaStatusDatatype>(getMfaStatus, [
//     doRefetchMfaStatus,
//   ]);
//   console.log({ data, type: status });

//   switch (status) {
//     case ResponseStatus.Pending: {
//       return <p>Loading...</p>;
//     }
//     case ResponseStatus.Reject: {
//       throw new Error(data.toString());
//     }
//     case ResponseStatus.Resolved: {
//       const { isMfaAuthenticated, mfaCodeLength } = data;
//       if (!isMfaAuthenticated) {
//         return (
//           <Mfa
//             length={mfaCodeLength}
//             setDoRefetchMfaStatus={setDoRefetchMfaStatus}
//           />
//         );
//       }
//       return (
//         <setDoRefetchMfaStatusContext.Provider value={setDoRefetchMfaStatus}>
//           <div>{children}</div>;
//         </setDoRefetchMfaStatusContext.Provider>
//       );
//     }
//   }
// };
