import { NextFunction, Request, Response } from 'express';
import { checkMfaStatus } from './get';

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
