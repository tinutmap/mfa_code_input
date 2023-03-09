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

export const getMfaStatus = (): Promise<void | MfaStatusDatatype> => {
  // let data;
  return fetch('http://localhost:3000/mfa/status')
    .then((res) => res.json() as Promise<MfaStatusDatatype>)
    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
};
