import React, { FC, useRef, Dispatch } from 'react';
import { MfaCodeDigitTile } from './MfaCodeDigitTile';

type MfaTilesProps = {
  code: string[];
  setCode: Dispatch<React.SetStateAction<string[]>>;
};
export const MfaTiles: FC<MfaTilesProps> = ({ code, setCode }) => {
  const currentTileIndex = useRef(0);

  return (
    <>
      {code.map((digit, index) => (
        <MfaCodeDigitTile
          key={index}
          index={index}
          digit={digit}
          setCode={setCode}
          isCurrentTile={currentTileIndex.current === index}
          currentTileIndex={currentTileIndex}
        />
      ))}
    </>
  );
};
