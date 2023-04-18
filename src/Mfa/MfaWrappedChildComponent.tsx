import { ResponseStatus } from '../lib/useAsync';
import { MfaExpiredDateTimeDatatype, getMfaExpiredDateTime } from './Mfa.query';
import { useAsync } from '../lib/useAsync';
import React, { useState } from 'react';

export const MfaWrappedChildComponent = () => {
  const [doRefetch, setDoRefetch] = useState(false);
  const { data, status } = useAsync<MfaExpiredDateTimeDatatype>(
    getMfaExpiredDateTime,
    [doRefetch]
  );
  console.log({ data, type: status });

  switch (status) {
    case ResponseStatus.Pending: {
      return <p>Loading...</p>;
    }
    case ResponseStatus.Reject: {
      throw new Error(data.toString());
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
            onClick={async () => setDoRefetch((state: boolean) => !state)}
            value="Check MFA Expiration Time Again. If clicked after expiration time, this will prompt MFA process."
          />
        </div>
      );
    }
  }
};
