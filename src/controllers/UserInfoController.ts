import { Controller } from './Controller';
import { UserInfo, userInfoModel } from '../models/UserInfoModel';

class UserInfoController extends Controller<UserInfo> {
  
  constructor() {
    super(userInfoModel);

    this.setRoutes([
      {
        method: 'GET',
        path: '/'
      },
      {
        method: 'GET',
        path: '/:id'
      },
      {
        method: 'POST',
        path: '/'
      },
      {
        method: 'PUT',
        path: '/:id'
      },
      {
        method: 'PATCH',
        path: '/:id'
      },
      {
        method: 'DELETE',
        path: '/:id'
      }
    ]);
  }
}

export const userInfoController = new UserInfoController();

export const userInfoRouter = userInfoController.router;