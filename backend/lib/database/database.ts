import sqlite3 = require('sqlite3');
import fs = require('fs');

const sqlite = sqlite3.verbose();
const FILE_PATH = './backend/lib/database/database.db';

export function createDbConnection() {
  if (fs.existsSync(FILE_PATH)) {
    return new sqlite3.Database(FILE_PATH);
  } else {
    const db = new sqlite.Database(FILE_PATH, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
    });
    console.log('Connection with SQLite has been established');
    return db;
  }
}

function createTable(db: sqlite3.Database) {
  db.exec(`
  CREATE TABLE MfaRecords
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) NOT NULL,
    created_time TEXT DEFAULT CURRENT_TIMESTAMP 
  );
`);
}
