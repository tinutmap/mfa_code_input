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
  // return initialState;
}

interface stateType {
  status: ResponseStatus;
  data: any;
}

export enum ResponseStatus {
  Resolved = 'RESOLVED',
  Reject = 'REJECT',
  Pending = 'PENDING',
}

// const initialState: stateType = {
//   type: ResponseType.Pending,
//   data: undefined,
//   //   status: undefined,
// };

// interface useAsyncProps {
//   func: () => Promise<stateType>;
//   dependencyArray: any[];
// }

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
        dispatch({ status: ResponseStatus.Reject, data: e });
      });
  }, dependencyArray);
  return { ...state };
}
