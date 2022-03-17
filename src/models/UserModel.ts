import Model from './Model';
import IObject from '../interfaces/IObject';

export interface User {
  id: number,
  username: string,
  password: string,
  role: string
};

class UserModel extends Model<User> {

  protected formatRow(row: IObject): User {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      role: row.role
    };
  }

}

export const userModel = new UserModel();