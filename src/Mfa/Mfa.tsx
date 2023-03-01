import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

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
  const [code, setCode] = useState(Array.from({ length: length }, (_) => ''));

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
  const isMfaAuthenticated = false;

  if (!isMfaAuthenticated) {
    return <MfaTiles length={6} />;
  }
  return <div>{children}</div>;
};
