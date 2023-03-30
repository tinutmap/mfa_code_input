import { db } from '../../backend';
// import RunResult
import { MOCKED_USER_ID, MOCKED_SESSION_ID } from './constants';

export async function createMfaCode() {
  const CODE_LENGTH = 6;
  const upperRandomBound = 10 ** CODE_LENGTH;
  const code = Math.floor(Math.random() * upperRandomBound)
    .toString()
    .padStart(CODE_LENGTH, '0');

  const sql = `
    INSERT INTO MfaCodeRecords (user_id, session_id, code)
    VALUES (
      '${MOCKED_USER_ID}',
      '${MOCKED_SESSION_ID}',
      ${code}
    )
    ON CONFLICT(user_id, session_id) DO
    UPDATE SET
      code = ${code},
      created_time = CURRENT_TIMESTAMP
    WHERE
      user_id = '${MOCKED_USER_ID}' AND
      session_id = '${MOCKED_SESSION_ID}'
`;

  await new Promise((resolve, reject) => {
    db.run(sql, async function (err) {
      if (err) {
        return reject(console.log(err.message));
      } else {
        resolve(console.log('code created/updated successfully'));
      }
    });
  });
}
