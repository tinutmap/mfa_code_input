import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createDbConnection } from './lib/database/database';
import { checkMfaStatus } from './routes/mfa/get';
import { createMfaCode } from './routes/mfa/set';

dotenv.config({ path: '.env.development.local', debug: true });

const app: Express = express();
const port = process.env.BACKEND_PORT;

export const db = createDbConnection();

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
  return res.sendStatus(200);
});
app.post('/mfa/send-code', async (req, res, next) => {
  // const testMessageUrl = await createMfaCode();
  // res.redirect(testMessageUrl as string);
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
