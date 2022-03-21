import express from 'express';
import { appConfig } from './config';
import User from './models/User';
import UserInfo from './models/UserInfo';
// import { authRouter } from './controllers/AuthController';
// import { userRouter } from './controllers/UserController';
// import { userInfoRouter } from './controllers/UserInfoController';

async function main(): Promise<void> {
  const app = express();
  
  // Init middleware
  app.use(express.json());

  app.get('/', async (req, res) => {
    // const user = await User.findByPk(1, { include: UserInfo });

    const user = await User.findByPk(1);
    const userInfo = await user?.getUserInfo();

    if (user && userInfo) {
      res.json({
        user: user.toJSON(),
        userInfo: userInfo.toJSON()
      });
    } else {
      res.status(404).json({
        msg: 'user #1 is not saved'
      });
    }
  });

  // Routes
  // app.use('/api/auth', authRouter);
  // app.use('/api/user', userRouter);
  // app.use('/api/user-info', userInfoRouter);
  
  app.listen(appConfig.port, () => console.log(`Server started on port ${appConfig.port}`));
}

main();