import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { getMfaStatus } from './Mfa.query';

const ALLOWED_KEY = Array.from({ length: 10 }, (_, i) => i.toString()).concat([
  // 'Backspace', 'Delete',
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
    />
  );
};

type MfaTilesProps = {
  length: number;
};
const MfaTiles: FC<MfaTilesProps> = ({ length }) => {
  const [code, setCode] = useState(Array.from({ length: length }, () => ''));
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

type MfaWrapperProps = {
  children?: ReactNode;
};

export const MfaWrapper: FC<MfaWrapperProps> = ({ children }): JSX.Element => {
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    let reduceTimer: NodeJS.Timer;
    if (timer > 0) {
      reduceTimer = setInterval(() => setTimer((time) => time - 1), 1000);
    }
    return () => clearInterval(reduceTimer);
  }, [timer]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMfaAuthenticated, setIsMfaAuthenticated] = useState(false);
  const [codeLength, setCodeLength] = useState(0);
  useEffect(() => {
    const getData = async () => {
      const data = await getMfaStatus();
      if (data) {
        setIsMfaAuthenticated(data?.isMfaAuthenticated);
        setCodeLength(data?.mfaCodeLength ?? 0);
        setIsLoaded(true);
      }
    };
    getData();
  }, []);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  if (!isMfaAuthenticated) {
    return (
      <>
        <MfaTiles length={codeLength} />
        <p>Timer {timer} second(s)</p>
      </>
    );
  }
  return <div>{children}</div>;
};
