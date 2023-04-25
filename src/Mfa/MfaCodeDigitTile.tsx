import React, {
  FC,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';

const ALLOWED_KEY = Array.from({ length: 10 }, (_, i) => i.toString()).concat([
  '',
]);

type MfaCodeDigitTileProps = {
  index: number;
  digit: string;
  setCode: Dispatch<SetStateAction<string[]>>;
  isCurrentTile: boolean;
  currentTileIndex: MutableRefObject<number>;
};

export const MfaCodeDigitTile: FC<MfaCodeDigitTileProps> = ({
  index,
  digit,
  setCode,
  isCurrentTile,
  currentTileIndex,
}) => {
  const updateCode = (value: string) => {
    if (ALLOWED_KEY.includes(value)) {
      setCode((code) => {
        const newCode = code;
        newCode[index] = value;
        if (value !== '') {
          currentTileIndex.current = index + 1;
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
        currentTileIndex.current = index - 1;
        return;
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
      value={digit}
      onChange={(e) => updateCode(e.target.value)}
      onKeyDown={(event) => handleKeyDown(event)}
      ref={tileRef}
      className="mfa-tile"
    />
  );
};
