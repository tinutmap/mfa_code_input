import React, {
  FC,
  ReactNode,
  useState,
  Dispatch,
  createContext,
  SetStateAction,
} from 'react';
import { ResponseStatus, useAsync } from '../lib/useAsync';
import { getMfaStatus, MfaStatusDatatype } from './Mfa.query';
import { Mfa } from './Mfa';

type MfaWrapperProps = {
  children?: ReactNode;
};

export const setDoRefetchMfaStatusContext = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => false);

export const MfaWrapper: FC<MfaWrapperProps> = ({ children }): JSX.Element => {
  const [doRefetchMfaStatus, setDoRefetchMfaStatus] = useState(false);
  const { data, status } = useAsync<MfaStatusDatatype>(getMfaStatus, [
    doRefetchMfaStatus,
  ]);
  console.log({ data, type: status });

  switch (status) {
    case ResponseStatus.Pending: {
      return <p>Loading...</p>;
    }
    case ResponseStatus.Reject: {
      throw new Error(data.toString());
    }
    case ResponseStatus.Resolved: {
      const { isMfaAuthenticated, mfaCodeLength } = data;
      if (!isMfaAuthenticated) {
        return (
          <Mfa
            length={mfaCodeLength}
            setDoRefetchMfaStatus={setDoRefetchMfaStatus}
          />
        );
      }
      return (
        <setDoRefetchMfaStatusContext.Provider value={setDoRefetchMfaStatus}>
          <div>{children}</div>;
        </setDoRefetchMfaStatusContext.Provider>
      );
    }
  }
};
