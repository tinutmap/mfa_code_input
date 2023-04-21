import { Dispatch, SetStateAction } from 'react';

export function filterMfaInvalidError(
  error: Error,
  setDoRefetchMfaStatus: Dispatch<SetStateAction<boolean>>
) {
  const errMessage = error?.message;

  try {
    const mfaInvalid = JSON.parse(errMessage)?.mfaInvalid;

    if (mfaInvalid) {
      return setDoRefetchMfaStatus((state) => !state);
    }
  } catch {
    // NOTE: intentionally blank, error will be in console.error() below
  }
  console.error(error);
}
