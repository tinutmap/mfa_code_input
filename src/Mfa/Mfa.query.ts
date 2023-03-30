export function testFetch() {
  fetch('http://localhost:3000/test')
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
}

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
