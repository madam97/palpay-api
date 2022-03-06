import mysql from 'mysql';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

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
    const entitySqlFile = path.join(__dirname, 'sql', action+'.sql');
    const commonSqlFile = path.join(__dirname, 'sql', 'Common', action.replace(/^.*?\//, '')+'.sql');

    // Entity SQL file
    if (fs.existsSync(entitySqlFile)) {
      fs.readFile(entitySqlFile, 'utf8', (err, rawSql) => {
        if (err) throw err;
  
        const sql = rawSql.replace('{PREFIX}', this.tablePrefix);
  
        this.db.query(sql, values, (err, res) => {
          if (err) throw err;
  
          callback( JSON.parse(JSON.stringify(res)) );
        });
      });
    }

    // Common SQL file
    else if (fs.existsSync(commonSqlFile)) {
      // Get the database table name from the action, PascalCase -> camel_case
      const entity = action.replace(/\/.*$/, '');
      const table = pluralize( entity.split(/(?=[A-Z])/).join('_').toLowerCase() );

      fs.readFile(commonSqlFile, 'utf8', (err, rawSql) => {
        if (err) throw err;
  
        const sql = rawSql.replace('{PREFIX}', this.tablePrefix).replace('{TABLE}', table);
  
        this.db.query(sql, values, (err, res) => {
          if (err) throw err;
  
          callback( JSON.parse(JSON.stringify(res)) );
        });
      });
    }
    
    // Error: no SQL files
    else {
      throw new Error(`Database error: there is no entity or common SQL file for ${action} action`);
    }
  }
}