import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from 'express';

const app = express();
const PORT = process.env.PORT || 1111;

app.get('/', (req,res) => {
  res.json({ msg: 'Working', port: process.env.PORT });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));