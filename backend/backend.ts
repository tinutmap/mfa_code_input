import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createDbConnection } from './lib/database/database';

dotenv.config({ path: '.env.development.local', debug: true });

const app: Express = express();
const port = process.env.BACKEND_PORT;

export const db = createDbConnection();

app.get('/*', (_, res, next) => {
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
app.get('/mfa/status', (req, res) => {
  return res.send({ isMfaAuthenticated: false, mfaCodeLength: 6 });
  // return res.send({ isMfaAuthenticated: true });
  // return res.status(404).send();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
