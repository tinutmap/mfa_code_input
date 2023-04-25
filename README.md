# Objectives:
This project showcases the author's Web Development capabilities by building a Multi Factor Authentication (MFA) mechanism with:
- React Frontend: techniques and best practices, especially various use cases of React Hooks in  UI.
- Node Express Backend for authentication process. It also equips with capability to send MFA code to user, and with a road map to include rate limiting to prevent user from abusing the system

Tech Stack: Typescript, Node Express, Sqlite database engine, React.

# Project Hightlights:
## Using MFA Wrapper Component in Frontend and  Higher-Order Function in Backend as checking gate for MFA status:
- In Frontend, MFA Wrapper Component determines whether to render <Mfa /> component for if MFA is not authenticated, otherwise render <MfaWrappedChildComponent />
```
  // App.tsx
  <MfaWrapper>
    <MfaWrappedChildComponent />
  </MfaWrapper>
```
```
  // Mfa.tsx
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
```
- In Backend, mfaGatingWrapperFn is a Higher-Order Function returning next or wrapped Function if MFA is still within valid timeframe, or return status 401 with { mfaInvalid: true } flag to Frontend.

```
  export async function mfaGatingWrapperFn(
    req: Request,
    res: Response,
    next: NextFunction,
    wrappedFn?: (req: Request, res: Response, next: NextFunction) => any
  ) {
    const count = await checkMfaStatus();
    if (count > 0) {
      return wrappedFn && typeof wrappedFn === 'function'
        ? wrappedFn(req, res, next)
        : next();
    }
    res.status(401).send({ mfaInvalid: true });
  }
  ...
  // NOTE: this route is created to test the mfaGatingWrapperFn, it will only respond if passing mfaGatingWrapperFn
  router.get(
    '/check-expire',  
    async (req, res, next) =>
      await mfaGatingWrapperFn(req, res, next, async () => {
        const authenticatedDateTime = new Date(
          (await getLastMfaAuthenticatedTime()) + ' UTC'
        );
        const mfaExpiredTime = new Date();
        mfaExpiredTime.setTime(
          authenticatedDateTime.getTime() +
            MFA_EXPIRATION_DURATION_IN_SECONDS * 1000
        );
        return res.send({ mfaExpiredTime });
      })
  );

```
## React Hooks Use Cases:
### `useState`:

- Used to hold state of interested variables
```
  const [timerInSeconds, setTimerInSeconds] = useState(-1); // NOTE: timer set to -1 denotes timer hasn't been set, to differentiate from timer === 0 which means it has expired
```
```
  const [errorMessage, setErrorMessage] = useState('');
```
```
  const [isCodeSubmittedFirstTime, setIsCodeSubmittedFirstTime] = useState(false);
```
- Used as a trigger to invoke component rerendering

```
  const [doRefetchMfaStatus, setDoRefetchMfaStatus] = useState(false);
```
### `useRef`:
- Use to reference an html element
```
  const tileRef = useRef<HTMLInputElement>(null);
  ...
  <input
    type="text"
    minLength={1}
    maxLength={1}
    value={digit}
    onChange={(e) => updateCode(e.target.value)}
    onKeyDown={(event) => handleKeyDown(event)}
    ref={tileRef}
    className="mfa-tile"
  />
```
- Use as variable that should not trigger component's rerendering when its state change
```
  const currentTileIndex = useRef(0);
  ...
  if (!digit) {
    event.preventDefault();
    currentTileIndex.current = index - 1;
    return;
  }

```
### `useEffect`:
- To perform effect after component's rendering or after state of a dependent variable changes
```
  // countdown timer logic in useEffect
  useEffect(() => {
    let reduceTimer: NodeJS.Timer;
    if (timerInSeconds > 0) {
      reduceTimer = setInterval(
        () => setTimerInSeconds((time) => time - 1),
        1000
      );
    }
    return () => clearInterval(reduceTimer);
  }, [timerInSeconds]);
```
```
  // error message
  useEffect(() => {
    // NOTE: remove error message when input changes after wrong code's input
    setErrorMessage('');

    // NOTE: submit code first time after code is filled up to required length
    if (code.join('').length === length && !isCodeSubmittedFirstTime) {
      submitMfaCodeCallBack();
    }
  }, [code]);
```
### `useReducer`:
- See the whole implementation in [`useAsync.tsx`](https://github.com/tinutmap/mfa_code_input/blob/b84386f448aadcf54d06b8954ac2f2504378aa33/src/lib/useAsync.tsx)
### `createContext` and `useContext`:
- Create and consume context's provider of props passing through the component's tree
```
  export const setDoRefetchMfaStatusContext = createContext<Dispatch<SetStateAction<boolean>>>(() => false);
  ...
  <setDoRefetchMfaStatusContext.Provider value={setDoRefetchMfaStatus}>
    <div>{children}</div>;
  </setDoRefetchMfaStatusContext.Provider>
  ...
  const setDoRefetchMfaStatus = useContext(setDoRefetchMfaStatusContext);
```
## React Error Boundary:
- Use to catch and handle errors at rendering. See [ErrorBoundary.tsx](https://github.com/tinutmap/mfa_code_input/blob/b84386f448aadcf54d06b8954ac2f2504378aa33/src/lib/ErrorBoundary.tsx)

# Disclaimer:
The scope of this project does not include or intend to venture in encryption techniques in masking MFA code stored in the database. It neither includes the user authentication/ user management/ session management as typically seen in production apps.



# First time setup:

## Prerequisites:
- Node https://nodejs.org/en/download/. If multiple Node versions needed for different projects on the same dev machine, use https://github.com/volta-cli
- Git Setup https://gist.github.com/tinutmap/c217e1a1693b5e422290a32d4d3c0060
- (Optional) VSCode Editor: https://code.visualstudio.com/download
## Create React App:
- `npx create-react-app mfa_code_input --template typescript`
- For adding ESLint and Prettier, see 'Add eslint' and 'Add prettier' commits.
- Setup Node Express with Typescript https://blog.logrocket.com/how-to-set-up-node-typescript-express/

# Setup and Running:
## Setup
- Clone project from Github
- At project root:
  - Run `npm install` to install the packages
## Running and Debug
- At project root:
  - Run `npm run start` to start the Frontend
  - Run `npm run backend-debug` to start the Backend

- Optionally, in VSCode Debug, Select `Run both-end`

![Run both_end debug](https://github.com/tinutmap/mfa_code_input/blob/master/public/run_both_ends_debug.png?raw=true)

# References:

- https://reactjs.org/docs/create-a-new-react-app.html
- https://create-react-app.dev/docs/getting-started
