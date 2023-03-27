// import { resolve } from 'path';
import { db } from '../../backend';

export async function checkMfaStatus(): Promise<number> {
  // res: Response,
  // next: NextFunction

  const TIME_LIMIT_IN_SECONDS = 1 * 60;
  const sql = `
        SELECT 
        COUNT(*) count
        FROM ( 
            SELECT
                code
            FROM MfaRecords
            WHERE ROUND((JULIANDAY('now') - JULIANDAY(created_time )) * 86400) < ${TIME_LIMIT_IN_SECONDS}
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
