import mysql from 'mysql';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';
import { toSnakeCase, toCamelCaseObject, toSnakeCaseObject } from './functions'; 

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
    const entity = action.replace(/\/.*$/, '');
    const fileName = action.replace(/^.*?\//, '');
    const entitySqlFile = path.join(__dirname, 'sql', action+'.sql');
    const commonSqlFile = path.join(__dirname, 'sql', 'Common', fileName+'.sql');

    // Format values
    if (Array.isArray(values)) {
      values.forEach((value, index) => {
        if (!Array.isArray(value) && typeof value === 'object') {
          values[index] = toSnakeCaseObject(value);
        }
      });
    } else if (typeof values === 'object') {
      values = toSnakeCaseObject(values);
    }

    console.log('Values: ', values);

    // Entity SQL file
    if (fs.existsSync(entitySqlFile)) {
      fs.readFile(entitySqlFile, 'utf8', (err, rawSql) => {
        if (err) throw err;
  
        const sql = rawSql.replace('{PREFIX}', this.tablePrefix);
  
        this.db.query(sql, values, (err, result) => {
          if (err) throw err;

          result = JSON.parse(JSON.stringify(result));

          if (Array.isArray(result)) {
            const res: object[] = [];
            result.map((row: object) => {
              res.push( toCamelCaseObject(row) );
            });

            callback(res);
          } else {
            callback( toCamelCaseObject(result) );
          }
        });
      });
    }

    // Common SQL file
    else if (fs.existsSync(commonSqlFile)) {
      // Get the database table name from the action
      const table = pluralize( toSnakeCase(entity) );

      fs.readFile(commonSqlFile, 'utf8', (err, rawSql) => {
        if (err) throw err;
  
        const sql = rawSql.replace('{PREFIX}', this.tablePrefix).replace('{TABLE}', table);
  
        this.db.query(sql, values, (err, result) => {
          if (err) throw err;

          result = JSON.parse(JSON.stringify(result));

          if (Array.isArray(result)) {
            const res: object[] = [];
            result.map((row: object) => {
              res.push( toCamelCaseObject(row) );
            });

            callback(res);
          } else {
            callback( toCamelCaseObject(result) );
          }
        });
      });
    }
    
    // Error: no SQL files
    else {
      throw new Error(`Database error: there is no entity or common SQL file for ${action} action`);
    }
  }
}