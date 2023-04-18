// FIXME: [MFA-33] add try/catch to async queries and error handling as res.json() can potentially throws error.

export type MfaStatusDatatype = {
  isMfaAuthenticated: boolean;
  mfaCodeLength: number;
};

export const getMfaStatus = async (): Promise<MfaStatusDatatype> => {
  // NOTE: no error try/catch here as it errors handler in useAsync
  const res = await fetch('http://localhost:3000/mfa/status');
  if (res.ok) {
    return res.json() as Promise<MfaStatusDatatype>;
  } else throw new Error(`STATUS ${res.status}: ${res.statusText}`);
};

export const submitMfaCode = async (mfaCode: string) => {
  const res = await fetch('http://localhost:3000/mfa/submit-mfa-code', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ mfaCode }),
  });
  if (res.ok) {
    return true;
  }
  return false;
};

export interface sendMfaCodeType {
  timerDurationInMillisecond: number;
}

export const sendMfaCode = async () => {
  const res = await fetch('http://localhost:3000/mfa/send-code', {
    method: 'POST',
  });
  if (res.ok) {
    return res.json() as Promise<sendMfaCodeType>;
  } else throw new Error(`STATUS ${res.status}: ${res.statusText}`);
};

export type MfaErrorType = {
  mfaInvalid: boolean;
};
export type MfaExpiredDateTimeDatatype = {
  mfaExpiredTime: string;
};
export const getMfaExpiredDateTime = async () => {
  const res = await fetch('http://localhost:3000/mfa/check-expire', {
    method: 'GET',
  });
  if (res.ok) {
    return (await res.json()) as MfaExpiredDateTimeDatatype;
  }
  let mfaError;
  try {
    mfaError = (await res.json()) as MfaErrorType;
  } catch {
    throw new Error(`STATUS ${res.status}: ${res.statusText}`);
  }
  throw new Error(JSON.stringify({ ...mfaError }));
};
