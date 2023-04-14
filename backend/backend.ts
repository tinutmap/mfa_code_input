import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createDbConnection } from './lib/database/database';
import mfaRouter from './routes/mfa/routes';

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

app.use('/mfa', mfaRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
