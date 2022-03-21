import { Options } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

interface IDbConfig {
  user            : string,
  password        : string,
  database        : string,
  options         : Options,
  tablePrefix     : string
};

interface IAuthConfig {
  secret            : string,
  refreshSecret     : string,
  bcryptSaltRounds  : number
};

export const dbConfig: IDbConfig = {
  user            : process.env.DB_USER ?? '',
  password        : process.env.DB_PASSWORD ?? '',
  database        : process.env.DB_DATABASE ?? '',
  options         : {
    host          : process.env.DB_HOST ?? 'localhost',
    port          : process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect       : 'mysql'
  },

  tablePrefix     : process.env.DB_TABLE_PREFIX ?? ''
  // connectionLimit : process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10
};

export const authConfig: IAuthConfig = {
  secret            : process.env.AUTH_SECRET ?? 'secretkey', 
  refreshSecret     : process.env.AUTH_REFRESH_SECRET ?? 'refreshtokensecretkey',
  bcryptSaltRounds  : process.env.AUTH_BCRYPT_SALT_ROUNDS ? parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS) : 10
};

export default process.env;