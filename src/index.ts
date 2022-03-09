import dotenv from 'dotenv';
import express from 'express';
import Database from './Database';
import BankAccountEntity from './entities/BankAccountEntity';
import BankAccountRepository from './repositories/BankAccountRepository';

// Variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function main(): Promise<void> {
  // Database
  const db = new Database(process.env.DB_TABLE_PREFIX);
  await db.connect({
    host      : process.env.DB_HOST,
    port      : process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB_DATABASE
  });

  // API
  const app = express();

  app.get('/', async (req,res) => {
    res.json({ 
      status: 'ok',
      msg: 'Working', 
      test: process.env.TEST_AAAAAAA, 
      port: process.env.PORT 
    });
  });

  app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
}

main();