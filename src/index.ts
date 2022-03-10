import dotenv from 'dotenv';
import express from 'express';
import Database from './Database';
import userController from './controllers/UserController';
import userInfoController from './controllers/UserInfoController';
import bankAccountController from './controllers/BankAccountController';
import paymentController from './controllers/PaymentController';

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

  // ---------------------------------
  // -------------- API --------------
  // ---------------------------------

  const app = express();

  // Init middleware
  app.use(express.json());

  // Endpoints
  app.use('/users', userController(db));
  app.use('/user-info', userInfoController(db));
  app.use('/bank-accounts', bankAccountController(db));
  app.use('/payments', paymentController(db));

  app.get('/', async (req,res) => {

    // const repo = new BankAccountRepository(db);

    // const bankAccount = await repo.find(1);
    // const bankAccount = await repo.findOne(1);

    // let bankAccount = new BankAccountEntity({
    //   accountNumber: "43242343-43242134-98643134",
    //   balance: 10000
    // });
    // bankAccount = await repo.create(bankAccount);

    // const bankAccount = new BankAccountEntity({
    //   id: 100,
    //   accountNumber: "xxxxxxxx-43242134-98643134",
    //   balance: 5000
    // });
    // const updated = await repo.update(bankAccount);

    // const deleted = await repo.delete(7);

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