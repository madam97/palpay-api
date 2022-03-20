import { Controller } from './Controller';
import { User, userModel } from '../models/UserModel';
import { userInfoModel } from '../models/UserInfoModel';
import { bankAccountModel } from '../models/BankAccountModel';
import { userPartnerModel } from '../models/UserPartnerModel';
import IObject from '../interfaces/IObject';

class UserController extends Controller<User> {
  
  constructor() {
    super(userModel);

    this.setRoutes([
      {
        method: 'GET',
        path: '/:id/user-info',
        role: 'user',
        verifyUserId: true,
        func: this.getUserInfo.bind(this)
      },
      {
        method: 'PUT',
        path: '/:id/user-info',
        role: 'user',
        verifyUserId: true,
        func: this.putUserInfo.bind(this)
      },
      {
        method: 'GET',
        path: '/:id/bank-account',
        role: 'user',
        verifyUserId: true,
        func: this.getBankAccount.bind(this)
      },
      {
        method: 'GET',
        path: '/:id/partner',
        role: 'user',
        verifyUserId: true,
        func: this.getPartner.bind(this)
      },
      {
        method: 'POST',
        path: '/:id/partner',
        role: 'user',
        verifyUserId: true,
        func: this.postPartner.bind(this)
      },
      {
        method: 'PATCH',
        path: '/:id/partner/:partnerId',
        role: 'user',
        verifyUserId: true,
        func: this.patchPartner.bind(this)
      },
      {
        method: 'DELETE',
        path: '/:id/partner/:partnerId',
        role: 'user',
        verifyUserId: true,
        func: this.deletePartner.bind(this)
      }
    ]);
  }

  // GET /:id/user-info
  private async getUserInfo(id: number): Promise<object> {
    return await userInfoModel.findOneByUserId(id);
  }

  // PUT /:id/user-info
  private async putUserInfo(id: number, body: object): Promise<object> {
    const userInfo = userInfoModel.format({ ...body, id, userId: id });

    await userInfoModel.update(userInfo);

    return userInfo;
  }

  // GET /:id/bank-account
  private async getBankAccount(id: number): Promise<object> {
    return await bankAccountModel.findOneByUserId(id);
  }

  // GET /:id/partner
  private async getPartner(id: number): Promise<object[]> {
    return await userPartnerModel.findByUserId(id);
  }

  // POST /:id/partner
  private async postPartner(id: number, body: object): Promise<object> {
    const partner = userPartnerModel.format({ ...body, userId: id });

    return await userPartnerModel.create(partner);
  }

  // PATCH /:id/partner/:partnerId
  private async patchPartner(id: number, partnerId: number, body: IObject): Promise<object> {
    const partner = await userPartnerModel.findOne(partnerId);

    if (body.nickname) {
      partner.nickname = body.nickname;
  
      await userPartnerModel.update(partner);
    }

    return partner;
  }

  // DELETE /:id/partner/:partnerId
  private async deletePartner(id: number, partnerId: number): Promise<object> {
    const partner = await userPartnerModel.findOne(partnerId);
    
    await userPartnerModel.delete(partnerId);

    return partner;
  }

}

export const userController = new UserController();

export const userRouter = userController.router;