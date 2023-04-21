import { Dispatch, SetStateAction } from 'react';

export function filterMfaInvalidError(
  error: Error,
  setDoRefetchMfaStatus: Dispatch<SetStateAction<boolean>>
) {
  const errMessage = error?.message;

  try {
    const mfaInvalid = JSON.parse(errMessage)?.mfaInvalid;

    if (mfaInvalid) {
      setDoRefetchMfaStatus((state) => !state);
    }
    // return new Error(...Object.values(error));
    // return error;
  } catch {
    // return new Error(...Object.values(error));
    // throw error;
    // return error;
  }
  return new Error(...Object.values(error));
}
