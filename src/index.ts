import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './db';

// Variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Database
const db = dbConnect({
  host      : process.env.DB_HOST,
  port      : process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  database  : process.env.DB_DATABASE
});

// API
const app = express();

app.get('/', (req,res) => {
  const sql = 'SELECT * FROM palpay__users';
  db.query(sql, (err, result) => {
    if (err) throw err;

    res.json({ 
      sql: result,
      msg: 'Working', 
      test: process.env.TEST_AAAAAAA, 
      port: process.env.PORT 
    });
  });
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));