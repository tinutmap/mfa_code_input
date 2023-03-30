import sqlite3 from 'sqlite3';
import fs from 'fs';

const sqlite = sqlite3.verbose();
const FILE_PATH = './backend/lib/database/database.db';

export function createDbConnection() {
  if (fs.existsSync(FILE_PATH)) {
    return new sqlite3.Database(FILE_PATH);
  } else {
    const db = new sqlite.Database(FILE_PATH, async (error) => {
      if (error) {
        return console.error(error.message);
      }
      await createTables(db);
    });
    console.log('Connection with SQLite has been established');
    return db;
  }
}

async function createTables(db: sqlite3.Database) {
  const sqlStatements = [
    `
  CREATE TABLE MfaCodeRecords
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR NOT NULL,
    session_id VARCHAR NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_time TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id,session_id)
  );
`,
    `
  CREATE TABLE MfaAuthenticationSessionRecords
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR NOT NULL,
    session_id VARCHAR NOT NULL,
    authenticated_time TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id,session_id)
  );
`,
  ];

  Promise.all(
    sqlStatements.map(
      (sql) =>
        new Promise((resolve, reject) => {
          db.exec(sql, (error) => {
            if (error) {
              return reject(console.log(error.message));
            }
            return resolve(console.log('Table created OK'));
          });
        })
    )
  );
}
