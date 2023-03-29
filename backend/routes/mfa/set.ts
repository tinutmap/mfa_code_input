import { db } from '../../backend';
// import RunResult

export async function createMfaCode() {
  const CODE_LENGTH = 6;
  const upperRandomBound = 10 ** CODE_LENGTH;
  const code = Math.floor(Math.random() * upperRandomBound)
    .toString()
    .padStart(CODE_LENGTH, '0');
  const currentDateTime = new Date(Date.now()).toUTCString();
  //   const sql = `
  //         INSERT INTO MfaRecords (code, created_time)
  //         VALUES (${code}, '${currentDateTime}')
  //     `;

  const sql = `
    INSERT INTO MfaRecords (code)
    VALUES (${code})
`;

  await new Promise((resolve, reject) => {
    db.run(sql, async function (err) {
      if (err) {
        return reject(console.log(err.message));
      } else {
        resolve(console.log('code created successfully'));
      }
    });
  });
}
