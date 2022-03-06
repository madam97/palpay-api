import mysql from 'mysql';
import fs from 'fs';
import path from 'path';

type QueryCallback = (result: object) => void;

export default class Database {
  private db: mysql.Connection;
  private tablePrefix: string;

  constructor(config: mysql.ConnectionConfig, tablePrefix?: string) {
    this.db = mysql.createConnection(config);
    this.tablePrefix = tablePrefix ? tablePrefix : '';

    this.db.connect((err) => {
      if (err) throw err;
  
      console.log('MySQL connected...');
    });
  }

  public escape(value: any, stringifyObjects?: boolean | undefined, timeZone?: string | undefined): string {
    return mysql.escape(value, stringifyObjects, timeZone);
  }

  public query(action: string, callback: QueryCallback): void {
    this.exec(action, [], callback);
  }

  public exec(action: string, values: any, callback: QueryCallback): void {
    fs.readFile(path.join(__dirname, 'sql', action+'.sql'), 'utf8', (err, rawSql) => {
      if (err) throw err;

      const sql = rawSql.replace('TPX_', this.tablePrefix);

      this.db.query(sql, values, (err, res) => {
        if (err) throw err;

        callback(JSON.parse(JSON.stringify(res)) );
      });
    });
  }
}