import React, { FC, ReactNode, useState } from "react";

const ALLOWED_KEY = Array.from({length: 10}, (_,i)=> i.toString()).concat( [
  // 'Backspace', 'Delete',
  ''
])

type MfaCodeDigitTileProps = {
  index: number
  digit: string
  setCode: React.Dispatch<React.SetStateAction<string[]>>

}

const MfaCodeDigitTile: FC<MfaCodeDigitTileProps> = ({
  index,
  digit,
  setCode,
}) => {
  const updateCode = (value:string)=>{
    if (ALLOWED_KEY.includes(value)) {
      setCode(code => {
        const newCode = code
        newCode[index]=value
        // console.log({newCode})
        return [...newCode]
      })
    }
  }

  return (
    <input 
      type="text"
      minLength={1}
      maxLength={1}
      // placeholder={index.toString()}
      value={digit}
      onChange={(e)=> updateCode(e.target.value)}
      onKeyDown={(event)=> {
        if (event.key === 'Enter') {
          return console.log('Enter pressed')
        }
        if (event.key === 'Backspace' || event.key==='Delete') {
          return
        }
      }}
    />
  )

}

type MfaTilesProps= {
  length: number
  // code: string
}
const MfaTiles: FC<MfaTilesProps> = ({
  length,
  // code,
  // setCode
}) =>{
  const [code,setCode] = useState(
    Array.from({length: length}, (_,i)=> 
    // (i+1).toString()
    ''
    )
    )

  return (
    <>
      {code.map((digit,index) =>
        // <span> {digit} </span>
        <MfaCodeDigitTile key={index} index={index} digit={digit} setCode={setCode}/>
      )}
    </>
  )
}

type MfaWrapperProps = {
  children?: ReactNode
}

export const MfaWrapper: FC<MfaWrapperProps> = ({
    children
}):JSX.Element => {
  const isMfaAuthenticated = false

  if (!isMfaAuthenticated) {
    return (
      <MfaTiles
        //  code={code}
        // setCode={setCode}
        length={6}
      />
  )}
  return (
    <div>
      {children}
    </div>
  )
}