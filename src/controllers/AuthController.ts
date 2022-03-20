import { Controller } from './Controller';
import { User, userModel } from '../models/UserModel';
import { userInfoModel } from '../models/UserInfoModel';
import { auth } from '../services/Auth';
import IObject from '../interfaces/IObject';

class AuthController extends Controller<User> {

  constructor() {
    super(userModel);

    this.setRoutes([
      {
        method: 'POST',
        path: '/login',
        func: this.login.bind(this)
      },
      // {
      //   method: 'POST',
      //   path: '/logout',
      //   role: 'user',
      //   func: this.logout.bind(this)
      // },
      // {
      //   method: 'POST',
      //   path: '/refresh',
      //   role: 'user',
      //   func: this.refresh.bind(this)
      // }
    ]);
  }

  private async login(body: IObject): Promise<object> {
    if (!body.username || !body.password) {
      throw new Error('username and password required');
    }

    const user = await userModel.findOneByUsername(body.username);

    auth.verifyPassword(body.password, user.password);

    const userInfo = await userInfoModel.findOneByUserId(user.id);

    const token = auth.getToken({
      id: user.id, 
      name: userInfo.name ?? user.username, 
      role: user.role
    });

    return {
      msg: 'login was successful',
      token
    };
  }

  // private async logout(req: express.Request, res: express.Response): Promise<void> {
    
  // }

  // private async refresh(req: express.Request, res: express.Response): Promise<void> {
    
  // }

}

export const authController = new AuthController();

export const authRouter = authController.router;