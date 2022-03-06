import dotenv from 'dotenv';
import express from 'express';
import Database from './database';

// Variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Database
const db = new Database(
  {
    host      : process.env.DB_HOST,
    port      : process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB_DATABASE
  },
  process.env.DB_TABLE_PREFIX
);

// API
const app = express();

app.get('/', (req,res) => {
  db.exec('User/selectOne', [1], (result) => {
    console.log(result);

    res.json({ 
      status: 'ok',
      msg: 'Working', 
      test: process.env.TEST_AAAAAAA, 
      port: process.env.PORT 
    });
  });
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));