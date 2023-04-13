import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createDbConnection } from './lib/database/database';
import {
  checkMfaCode,
  checkMfaStatus,
  getLastMfaCreatedTime,
} from './routes/mfa/get';
import {
  createMfaAuthenticationSessions,
  createMfaCode,
} from './routes/mfa/set';
import { TIMER_DURATION_IN_MILLISECOND } from './routes/mfa/constants';

dotenv.config({ path: '.env.development.local', debug: true });

const app: Express = express();
const port = process.env.BACKEND_PORT;

export const db = createDbConnection();

// For parsing application/json
app.use(express.json());

app.get('/*', (_, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});

app.options('/*', (_, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.set('Access-Control-Allow-Headers', '*');
  next();
});
app.post('/*', (_, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/test', (req, res, next) => {
  console.log({ req, res, next });
  return res.send({ test: '123' });
});
app.get('/mfa/status', async (req, res) => {
  const count = await checkMfaStatus();
  if (count > 0) {
    return res.send({ isMfaAuthenticated: true });
  } else {
    return res.send({ isMfaAuthenticated: false, mfaCodeLength: 6 });
  }
});
app.post('/mfa/submit-mfa-code', async (req, res) => {
  const { body } = req;
  const isMfaCodeMatched = await checkMfaCode(body.mfaCode);

  if (!isMfaCodeMatched) return res.sendStatus(401);

  await createMfaAuthenticationSessions();
  return res.sendStatus(200);
});
app.post('/mfa/send-code', async (req, res, next) => {
  let lastMfaCodeCreatedTime = await getLastMfaCreatedTime();
  if (lastMfaCodeCreatedTime) lastMfaCodeCreatedTime += ' UTC'; // NOTE: needed to append ' UTC' timezone here in order to parse correctly. SQLite does not carry timezone.
  if (
    !lastMfaCodeCreatedTime || // NOTE: this condition covers the case no MfaCode has ever generated.
    Date.now() - Date.parse(lastMfaCodeCreatedTime) >
      TIMER_DURATION_IN_MILLISECOND
  ) {
    const testMessageUrl = await createMfaCode();
    // res.redirect(testMessageUrl as string);
    return res
      .status(200)
      .send({ timerDurationInMillisecond: TIMER_DURATION_IN_MILLISECOND });
  }
  return res.sendStatus(401);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
