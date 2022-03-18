import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';
import config from './config';
import { toSnakeCase, toCamelCaseObject } from './functions';
import IObject from './interfaces/IObject';

class Database {
  private db: mysql.Pool;
  private poolOptions: mysql.PoolOptions;
  private tablePrefix: string;

  constructor(poolOptions: mysql.PoolOptions, tablePrefix?: string) {
    this.poolOptions = poolOptions;
    this.tablePrefix = tablePrefix ? tablePrefix : '';
  }

  public async connect() {
    this.db = await mysql.createPool(this.poolOptions);

    console.log('MySQL connected...');
  }

  public escape(value: any): string {
    return mysql.escape(value);
  }

  public async select(action: string, values: any[] = []): Promise<IObject[]> {
    this.validateAction(action, 'select');

    const result = await this.exec(action, values);

    if (!Array.isArray(result)) {
      throw Error(`Database error: ${action} query result is not an array`);
    }

    // const res: object[] = [];
    // result.map((row: object) => {
    //   res.push( toCamelCaseObject(row) );
    // });

    // return res;

    return result;
  }

  public async selectOne(action: string, values: any): Promise<IObject> {
    this.validateAction(action, 'select');

    const result = await this.exec(action, !Array.isArray(values) ? [values] : values);

    if (!Array.isArray(result)) {
      throw Error(`Database error: ${action} query result is not an array`);
    } else if (result.length !== 1) {
      throw Error(`Database error: ${action} query was not successful`);
    }

    // return toCamelCaseObject(result[0]);

    return result[0];
  }

  public async insert(action: string, values: any[]): Promise<number> {
    this.validateAction(action, 'insert');

    const result: IObject = await this.exec(action, values);

    if (!result.insertId) {
      throw Error(`Database error: ${action} query was not successful`);
    }

    return result.insertId;
  }

  public async update(action: string, values: any[]): Promise<boolean> {
    this.validateAction(action, 'update');
    
    const result: IObject = await this.exec(action, values);

    if (!result.affectedRows) {
      throw Error(`Database error: ${action} query was not successful`);
    }

    return typeof result.changedRows === 'number' && 0 < result.changedRows;
  }

  public async delete(action: string, values: any): Promise<boolean> {
    this.validateAction(action, 'delete');

    const result: IObject = await this.exec(action, !Array.isArray(values) ? [values] : values);

    if (!result.affectedRows) {
      throw Error(`Database error: ${action} query was not successful`);
    }

    return true;
  }

  private async exec(action: string, values: any[]): Promise<IObject | IObject[]> {
    if (!this.db) {
      await this.connect();
    }

    const entity = action.replace(/\/.*$/, '');
    const fileName = action.replace(/^.*?\//, '');

    const entitySqlFile = path.join(__dirname, 'sql', action+'.sql');
    const commonSqlFile = path.join(__dirname, 'sql', 'Common', fileName+'.sql');
    const useEntityFile = fs.existsSync(entitySqlFile);

    if (!useEntityFile && !fs.existsSync(commonSqlFile)) {
      throw new Error(`Database error: there is no entity or common SQL file for ${action} action`);
    }

    // values = this.formatExecValues(values);

    const rawSql = fs.readFileSync(useEntityFile ? entitySqlFile : commonSqlFile, 'utf8');
    let sql = rawSql.replace('{PREFIX}', this.tablePrefix);
    if (!useEntityFile) {
      const table = pluralize( toSnakeCase(entity) );
      sql = sql.replace('{TABLE}', table);
    }

    const [result] = await this.db.execute(sql, values);

    return /^(insert|update|delete)/i.test(fileName) ? result as IObject : result;
  }

  private validateAction(action: string, neededActionType: string): void {
    const regex = new RegExp('/'+neededActionType, 'i');

    if (!regex.test(action)) {
      throw new Error(`Database error: ${action} query's type is not ${neededActionType}`);
    }
  }

  // private formatExecValues(values: any): any {
  //   if (Array.isArray(values)) {
  //     values.forEach((value, index) => {
  //       if (!Array.isArray(value) && typeof value === 'object') {
  //         values[index] = toSnakeCaseObject(value);
  //       }
  //     });
  //   } else if (typeof values === 'object') {
  //     values = toSnakeCaseObject(values);
  //   }

  //   return values;
  // }
}

export default new Database(
  {
    host            : config.DB_HOST,
    port            : config.DB_PORT ? parseInt(config.DB_PORT) : undefined,
    user            : config.DB_USER,
    password        : config.DB_PASSWORD,
    database        : config.DB_DATABASE,
    connectionLimit : config.DB_CONNECTION_LIMIT ? parseInt(config.DB_CONNECTION_LIMIT) : 10
  },
  config.DB_TABLE_PREFIX
);