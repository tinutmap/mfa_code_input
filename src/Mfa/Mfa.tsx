import React, { FC, ReactNode, useEffect, useRef, useState } from "react";

const ALLOWED_KEY = Array.from({length: 10}, (_,i)=> i.toString()).concat( [
  // 'Backspace', 'Delete',
  ''
])

type MfaCodeDigitTileProps = {
  index: number
  digit: string
  setCode: React.Dispatch<React.SetStateAction<string[]>>
  setCurrentTileIndex: React.Dispatch<React.SetStateAction<number>>
  isCurrentTile: boolean
  id: string
}

const MfaCodeDigitTile: FC<MfaCodeDigitTileProps> = ({
  index,
  digit,
  setCode,
  isCurrentTile,
  setCurrentTileIndex,
  id,
}) => {
  const updateCode = (value:string)=>{
    if (ALLOWED_KEY.includes(value)) {
      setCode(code => {
        const newCode = code
        newCode[index]=value
        // console.log({newCode})
        if (value !== '') {
          setCurrentTileIndex(index+1)
        }
        // new KeyboardEvent('keydown', key: 'Tab')
        return [...newCode]
      })
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>)=>{
    if (event.key === 'Enter') {
      return console.log('Enter pressed')
    }
    if (event.key === 'Backspace' || event.key==='Delete') {
      if (digit) return
      if (!digit) {
        event.preventDefault()
        return setCurrentTileIndex(index -1 )}
    }
  }
    const tileRef = useRef<HTMLInputElement>(null)
    useEffect(()=>  {
      if (tileRef.current && isCurrentTile)  {
         tileRef.current.focus()
      }
    },[isCurrentTile])

  return (
    <input 
      type="text"
      minLength={1}
      maxLength={1}
      // placeholder={index.toString()}
      value={digit}
      onChange={(e)=> updateCode(e.target.value)}
      onKeyDown={(event)=> 
      //   {
      //   if (event.key === 'Enter') {
      //     return console.log('Enter pressed')
      //   }
      //   if (event.key === 'Backspace' || event.key==='Delete') {
      //     return
      //   }
      // }
      handleKeyDown(event)
      }
      id={id}
      ref={tileRef}
      // autoFocus={isCurrentTile}
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
  useEffect(()=>{
    // if (!code.includes('')){
        // setCurrentTileIndex(t=>Math.min(t+1,code.join('').length))
    // }
  },[code,length])

  const [currentTileIndex, setCurrentTileIndex] = useState(0)
  const focusTile = useRef()
  // useEffect(()=> console.log(focusTile.current),[currentTileIndex])
  return (
    <>
      {code.map((digit,index) =>
        // <span> {digit} </span>
        <MfaCodeDigitTile key={index} index={index} digit={digit} setCode={setCode} isCurrentTile={currentTileIndex === index} id={'tile'+index}
        //  ref={currentTileIndex === index && focusTile}
        setCurrentTileIndex = {setCurrentTileIndex}
         />
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