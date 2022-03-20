import { Controller } from './Controller';
import { User, userModel } from '../models/UserModel';
import { userInfoModel } from '../models/UserInfoModel';
import { auth, AuthUser } from '../services/Auth';
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
      {
        method: 'POST',
        path: '/logout',
        role: 'user',
        func: this.logout.bind(this)
      },
      {
        method: 'POST',
        path: '/refresh',
        role: 'user',
        func: this.refresh.bind(this)
      }
    ]);
  }

  private async getAuthUser(user: User): Promise<AuthUser> {
    const userInfo = await userInfoModel.findOneByUserId(user.id);

    const authUser: AuthUser = {
      id: user.id, 
      name: userInfo.name ?? user.username, 
      role: user.role
    };

    return authUser;
  }

  private async login(body: IObject): Promise<object> {
    if (!body.username || !body.password) {
      throw new Error('username and password required');
    }

    const user = await userModel.findOneByUsername(body.username);

    auth.verifyPassword(body.password, user.password);

    const authUser = await this.getAuthUser(user);

    const token = auth.getToken(authUser);
    const refreshToken = auth.getToken(authUser, false);

    user.refreshToken = refreshToken;

    userModel.update(user);

    return {
      msg: 'login was successful',
      token,
      refreshToken
    };
  }

  private async logout(body: IObject): Promise<object> {
    const payload = auth.verifyToken(body.refreshToken, false);

    const user = await userModel.findOne(payload.user.id);

    user.refreshToken = null;

    userModel.update(user);

    return {
      msg: 'logout was successful'
    };
  }

  private async refresh(body: IObject): Promise<object> {
    if (!body.refreshToken) {
      throw new Error('refresh token is required');
    }

    const payload = auth.verifyToken(body.refreshToken, false);

    const user = await userModel.findOne(payload.user.id);
 
    const authUser = await this.getAuthUser(user);

    const token = auth.getToken(authUser);

    return {
      msg: 'access token refresh was successful',
      token
    };
  }

}

export const authController = new AuthController();

export const authRouter = authController.router;