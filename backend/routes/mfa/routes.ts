import express from 'express';
import { createMfaAuthenticationSessions, createMfaCode } from './set';
import { checkMfaCode, getLastMfaCreatedTime, checkMfaStatus } from './get';
import { TIMER_DURATION_IN_MILLISECOND } from './constants';
import { mfaGatingWrapperFn } from './mfaGatingFn';

const router = express.Router();

router.get('/status', async (req, res) => {
  const count = await checkMfaStatus();
  if (count > 0) {
    return res.send({ isMfaAuthenticated: true });
  } else {
    return res.send({ isMfaAuthenticated: false, mfaCodeLength: 6 });
  }
});

router.post('/submit-mfa-code', async (req, res) => {
  const { body } = req;
  const isMfaCodeMatched = await checkMfaCode(body.mfaCode);

  if (!isMfaCodeMatched) return res.sendStatus(401);

  await createMfaAuthenticationSessions();
  return res.sendStatus(200);
});

router.post('/send-code', async (req, res, next) => {
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

// NOTE: this route is created to test the mfaGatingWrapperFn, it will only respond if passing mfaGatingWrapperFn
router.get(
  '/test',
  async (req, res, next) =>
    await mfaGatingWrapperFn(req, res, next, () => {
      return res.send({ test: 'OK' });
    })
);

export default router;
