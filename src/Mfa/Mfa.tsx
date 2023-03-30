import React, {
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
  Dispatch,
} from 'react';
import { ResponseStatus, useAsync } from '../lib/useAsync';
import { getMfaStatus, MfaStatusDatatype, submitMfaCode } from './Mfa.query';
import './Mfa.css';

const ALLOWED_KEY = Array.from({ length: 10 }, (_, i) => i.toString()).concat([
  '',
]);

type MfaCodeDigitTileProps = {
  index: number;
  digit: string;
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentTileIndex: React.Dispatch<React.SetStateAction<number>>;
  isCurrentTile: boolean;
};

const MfaCodeDigitTile: FC<MfaCodeDigitTileProps> = ({
  index,
  digit,
  setCode,
  isCurrentTile,
  setCurrentTileIndex,
}) => {
  const updateCode = (value: string) => {
    if (ALLOWED_KEY.includes(value)) {
      setCode((code) => {
        const newCode = code;
        newCode[index] = value;
        if (value !== '') {
          setCurrentTileIndex(index + 1);
        }
        return [...newCode];
      });
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      return console.log('Enter pressed');
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (digit) return;
      if (!digit) {
        event.preventDefault();
        return setCurrentTileIndex(index - 1);
      }
    }
  };
  const tileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tileRef.current && isCurrentTile) {
      tileRef.current.focus();
    }
  }, [isCurrentTile]);

  return (
    <input
      type="text"
      minLength={1}
      maxLength={1}
      placeholder={index.toString()}
      value={digit}
      onChange={(e) => updateCode(e.target.value)}
      onKeyDown={(event) => handleKeyDown(event)}
      ref={tileRef}
      className="mfa-tile"
    />
  );
};

type MfaTilesProps = {
  // length: number;
  code: string[];
  setCode: Dispatch<React.SetStateAction<string[]>>;
};
const MfaTiles: FC<MfaTilesProps> = ({ code, setCode }) => {
  // const [code, setCode] = useState(Array.from({ length: length }, () => ''));
  const [currentTileIndex, setCurrentTileIndex] = useState(0);

  return (
    <>
      {code.map((digit, index) => (
        <MfaCodeDigitTile
          key={index}
          index={index}
          digit={digit}
          setCode={setCode}
          isCurrentTile={currentTileIndex === index}
          setCurrentTileIndex={setCurrentTileIndex}
        />
      ))}
    </>
  );
};
type MfaProps = {
  length: number;
  setDoRefetchMfaStatus: Dispatch<React.SetStateAction<boolean>>;
};
const Mfa: FC<MfaProps> = ({ length, setDoRefetchMfaStatus }) => {
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    let reduceTimer: NodeJS.Timer;
    if (timer > 0) {
      reduceTimer = setInterval(() => setTimer((time) => time - 1), 1000);
    }
    return () => clearInterval(reduceTimer);
  }, [timer]);

  const [code, setCode] = useState(Array.from({ length: length }, () => ''));

  return (
    <>
      <MfaTiles code={code} setCode={setCode} />
      <div>
        <button
          onClick={async () => {
            if (await submitMfaCode(code.toString())) {
              setDoRefetchMfaStatus((state) => !state);
            }
          }}
        >
          Submit MFA Code
        </button>
      </div>
      <p>Timer {timer} second(s)</p>
    </>
  );
};

type MfaWrapperProps = {
  children?: ReactNode;
};

export const MfaWrapper: FC<MfaWrapperProps> = ({ children }): JSX.Element => {
  const [doRefetchMfaStatus, setDoRefetchMfaStatus] = useState(false);
  const { data, status } = useAsync<MfaStatusDatatype>(getMfaStatus, [
    doRefetchMfaStatus,
  ]);
  console.log({ data, type: status });

  switch (status) {
    case ResponseStatus.Pending: {
      return <p>Loading...</p>;
    }
    case ResponseStatus.Reject: {
      return <p>Error {data.toString()}</p>;
    }
    case ResponseStatus.Resolved: {
      const { isMfaAuthenticated, mfaCodeLength } = data;
      if (!isMfaAuthenticated) {
        return (
          <Mfa
            length={mfaCodeLength}
            setDoRefetchMfaStatus={setDoRefetchMfaStatus}
          />
        );
      }
      return <div>{children}</div>;
    }
  }
};
