import Model from './Model';
import IObject from '../interfaces/IObject';

export interface UserInfo {
  id: number,
  userId: number,
  name: string,
  address: string,
  telephone: string,
  email: string
};


class UserInfoModel extends Model<UserInfo> {

  constructor() {
    super({
      userId: {
        required: true
      },
      name: {
        required: true
      },
      address: {
        required: true
      },
      telephone: {
        required: true
      },
      email: {
        required: true
      }
    });
  }

  public format(data: IObject): UserInfo {
    return {
      id: data.id,
      userId: data.user_id ? data.user_id : data.userId,
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      email: data.email
    };
  }

}

export const userInfoModel = new UserInfoModel();