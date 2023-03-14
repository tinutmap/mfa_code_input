import { useEffect, useReducer } from 'react';

function reducerFunc(state: stateType, action: stateType) {
  switch (action.status) {
    case ResponseStatus.Resolved: {
      return (state = {
        ...state,
        data: action.data,
        status: ResponseStatus.Resolved,
      });
    }
    case ResponseStatus.Pending: {
      return (state = {
        ...state,
        status: ResponseStatus.Pending,
      });
    }
    default: {
      return (state = {
        ...state,
        status: ResponseStatus.Reject,
        data: action.data,
      });
    }
  }
}

interface stateType {
  status: ResponseStatus;
  // NOTE: can pass stateType<T> to data: T if more time to research.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export enum ResponseStatus {
  Resolved = 'RESOLVED',
  Reject = 'REJECT',
  Pending = 'PENDING',
}

export function useAsync<T>(
  callBackFn: () => Promise<T>,
  dependencyArray: [],
  initialState?: T
) {
  const [state, dispatch] = useReducer(reducerFunc, {
    status: ResponseStatus.Pending,
    data: {},
    ...initialState,
  });

  useEffect(() => {
    callBackFn()
      .then((result) => {
        dispatch({ status: ResponseStatus.Resolved, data: result });
      })
      .catch((e) => {
        dispatch({ status: ResponseStatus.Reject, data: e.message });
      });
  }, dependencyArray);
  return { ...state, data: state.data as T };
}
