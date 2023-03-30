// import { resolve } from 'path';
import { db } from '../../backend';
import { MOCKED_USER_ID, MOCKED_SESSION_ID } from './constants';

export async function checkMfaStatus(): Promise<number> {
  // res: Response,
  // next: NextFunction

  const TIME_LIMIT_IN_SECONDS = 1 * 60;
  const sql = `
        SELECT 
        COUNT(*) count
        FROM ( 
            SELECT
                *
            FROM MfaAuthenticationSessionRecords
            WHERE
              ROUND((JULIANDAY('now') - JULIANDAY(authenticated_time)) * 86400) < ${TIME_LIMIT_IN_SECONDS} AND
              user_id = '${MOCKED_USER_ID}' AND
              session_id = '${MOCKED_SESSION_ID}'
        )
    `;
  interface RowCount {
    count: number;
  }
  return await new Promise((resolve, reject) => {
    db.get<RowCount>(sql, async (err, row: RowCount) => {
      if (err) {
        reject(err.message);
        return console.log(err.message);
      } else {
        return resolve(row?.count || 0);
      }
    });
  });
}
