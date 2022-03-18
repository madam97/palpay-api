import { Controller } from './Controller';
import { userInfoModel } from '../models/UserInfoModel';

class UserInfoController extends Controller {
  
  constructor() {
    super();

    this.setRoutes([
      {
        method: 'GET',
        path: '/',
        func: this.get.bind(this)
      },
      {
        method: 'GET',
        path: '/:id',
        func: this.getOne.bind(this)
      },
      {
        method: 'POST',
        path: '/',
        func: this.post.bind(this)
      },
      {
        method: 'PUT',
        path: '/:id',
        func: this.put.bind(this)
      },
      {
        method: 'PATCH',
        path: '/:id',
        func: this.patch.bind(this)
      },
      {
        method: 'DELETE',
        path: '/:id',
        func: this.delete.bind(this)
      }
    ]);
  }

  // GET /
  protected async get(): Promise<object[]> {
    const userInfos = await userInfoModel.find();

    return userInfoModel.toObjectArray(userInfos);
  }

  // GET /:id
  protected async getOne(id: number): Promise<object> {
    const userInfo = await userInfoModel.findOne(id);

    return userInfoModel.toObject(userInfo);
  }

  // POST /
  protected async post(body: object): Promise<object> {
    const userInfo = userInfoModel.format(body);

    const newUserInfo = await userInfoModel.create(userInfo);

    return userInfoModel.toObject(newUserInfo);
  }

  // PUT /:id
  protected async put(id: number, body: object): Promise<object> {
    const userInfo = userInfoModel.format({ ...body, id });

    await userInfoModel.update(userInfo);

    return userInfoModel.toObject(userInfo);
  }

  // PATCH /:id
  protected async patch(id: number, body: object): Promise<object> {
    const userInfo = await userInfoModel.findOne(id);
    const newUserInfo = userInfoModel.format({ ...userInfo, ...body, id });

    await userInfoModel.update(newUserInfo);

    return userInfoModel.toObject(newUserInfo);
  }

  // DELETE /:id
  protected async delete(id: number): Promise<object> {
    const userInfo = await userInfoModel.findOne(id);
    
    await userInfoModel.delete(id);

    return userInfoModel.toObject(userInfo);
  }
}

export const userInfoController = new UserInfoController();

export const userInfoRouter = userInfoController.router;