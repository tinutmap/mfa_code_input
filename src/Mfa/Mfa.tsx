import React, { FC } from "react";

type MfaWrapperProps = {
  children?: React.ReactNode
}

export const MfaWrapper: FC<MfaWrapperProps> = ({
    children
}):JSX.Element => {
  const isMfaAuthenticated = false

  if (!isMfaAuthenticated) {
    return (
      <div> MFA Tiles</div>
  )}
  return (
    <div>
      {children}
    </div>
  )
}