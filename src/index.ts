import express from 'express';
import config from './config';
import { userModel } from './models/UserModel';

async function main(): Promise<void> {
  const app = express();
  
  // Init middleware
  app.use(express.json());

  app.get('/', (req,res) => {
    res.json({
      user: userModel.findOne(1)
    });
  });
  
  app.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));
}

main();



// import dotenv from 'dotenv';
// import express from 'express';
// import Database from './Database';
// import Auth from './services/Auth';

// // Variables
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// async function main(): Promise<void> {
//   // Database
//   const db = new Database(process.env.DB_TABLE_PREFIX);
//   await db.connect({
//     host      : process.env.DB_HOST,
//     port      : process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
//     user      : process.env.DB_USER,
//     password  : process.env.DB_PASSWORD,
//     database  : process.env.DB_DATABASE
//   });

//   // Auth service
//   const auth = new Auth(
//     process.env.AUTH_SECRET ?? 'secretkey', 
//     process.env.AUTH_BCRYPT_SALT_ROUNDS ? parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS) : 10
//   );

//   // ---------------------------------
//   // -------------- API --------------
//   // ---------------------------------

//   const app = express();

//   // Init middleware
//   app.use(express.json());

//   // Endpoints
//   const authController = new AuthController(db, auth);
//   const userController = new UserController(db, auth);
//   const userInfoController = new UserInfoController(db, auth);
//   const bankAccountController = new BankAccountController(db, auth);
//   const paymentController = new PaymentController(db, auth);

//   app.use('/api/auth', authController.router);
//   app.use('/api/users', userController.router);
//   app.use('/api/user-info', userInfoController.router);
//   app.use('/api/bank-accounts', bankAccountController.router);
//   app.use('/api/payments', paymentController.router);

//   app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
// }

// main();