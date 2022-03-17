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

  protected formatRow(row: IObject): UserInfo {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      address: row.address,
      telephone: row.telephone,
      email: row.email
    };
  }

}

export const userInfoModel = new UserInfoModel();