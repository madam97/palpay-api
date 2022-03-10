import dotenv from 'dotenv';
import express from 'express';
import Database from './Database';
import Auth from './services/Auth';
import UserController from './controllers/UserController';
import UserInfoController from './controllers/UserInfoController';
import BankAccountController from './controllers/BankAccountController';
import PaymentController from './controllers/PaymentController';

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

  // Auth service
  const auth = new Auth(process.env.AUTH_SECRET ?? 'secretkey');

  // ---------------------------------
  // -------------- API --------------
  // ---------------------------------

  const app = express();

  // Init middleware
  app.use(express.json());

  // Endpoints
  const userController = new UserController(db);
  const userInfoController = new UserInfoController(db);
  const bankAccountController = new BankAccountController(db);
  const paymentController = new PaymentController(db);

  app.use('/api/users', userController.router);
  app.use('/api/user-info', userInfoController.router);
  app.use('/api/bank-accounts', bankAccountController.router);
  app.use('/api/payments', paymentController.router);

  app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
}

main();