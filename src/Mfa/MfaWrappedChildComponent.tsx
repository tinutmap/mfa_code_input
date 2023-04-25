import { ResponseStatus } from '../lib/useAsync';
import { MfaExpiredDateTimeDatatype, getMfaExpiredDateTime } from './Mfa.query';
import { useAsync } from '../lib/useAsync';
import React, { useState, useContext } from 'react';
import { setDoRefetchMfaStatusContext } from './MfaWrapper';
import { filterMfaInvalidError } from '../lib/filterMfaInvalidError';

export const MfaWrappedChildComponent = () => {
  const [
    doRefetch,
    //  setDoRefetch
  ] = useState(false);

  const setDoRefetchMfaStatus = useContext(setDoRefetchMfaStatusContext);
  const { data, status, error } = useAsync<MfaExpiredDateTimeDatatype>(
    getMfaExpiredDateTime,
    [doRefetch]
  );
  console.log({ data, type: status, error });

  switch (status) {
    case ResponseStatus.Pending: {
      return <p>Loading...</p>;
    }
    case ResponseStatus.Reject: {
      throw new Error(error?.message.toString());
    }
    case ResponseStatus.Resolved: {
      const { mfaExpiredTime } = data;
      return (
        <div>
          <p>{`MFA will expire in ${new Date(
            mfaExpiredTime
          ).toTimeString()}`}</p>
          <input
            type="button"
            onClick={async () => {
              // setDoRefetch((state: boolean) => !state)
              try {
                await getMfaExpiredDateTime();
              } catch (error) {
                filterMfaInvalidError(error as Error, setDoRefetchMfaStatus);
              }
            }}
            value="Check MFA Expiration Time Again. If clicked after expiration time, this will prompt MFA process."
          />
        </div>
      );
    }
  }
};
