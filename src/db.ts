import mysql from 'mysql';

export default function dbConnect(config: mysql.ConnectionConfig): mysql.Connection {
  const db = mysql.createConnection(config);

  db.connect((err) => {
    if (err) throw err;

    console.log('MySQL connected...');
  });

  return db;
}