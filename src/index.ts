import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

console.log(`|.env.${process.env.NODE_ENV}|`, process.env);

import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req,res) => {
  res.json({ msg: 'Working' });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));