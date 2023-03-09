import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development.local', debug: true });

const app: Express = express();
const port = process.env.BACKEND_PORT;

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
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
