import express from 'express';
import config from './config';
// import { authRouter } from './controllers/AuthController';
// import { userRouter } from './controllers/UserController';
// import { userInfoRouter } from './controllers/UserInfoController';

async function main(): Promise<void> {
  const app = express();
  
  // Init middleware
  app.use(express.json());

  // Routes
  // app.use('/api/auth', authRouter);
  // app.use('/api/user', userRouter);
  // app.use('/api/user-info', userInfoRouter);
  
  app.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));
}

main();