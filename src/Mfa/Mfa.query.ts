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
  // return fetch('http://localhost:3000/mfa/status')
  //   .then((res) => {
  //     try {
  //       if (res.ok) {
  //         return res.json() as Promise<MfaStatusDatatype>;
  //       }
  //       throw new Error(res.status.toString());
  //     } catch (err) {
  //       throw new Error(err as string);
  //     }
  //   })
  //   .catch((error) => {
  //     throw new Error(error as string);
  //   });
  const res = await fetch('http://localhost:3000/mfa/status');
  if (res.ok) {
    return res.json() as Promise<MfaStatusDatatype>;
  } else throw new Error(`STATUS ${res.status}: ${res.statusText}`);
};
