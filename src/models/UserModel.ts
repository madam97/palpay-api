import { Model } from './Model';
import IObject from '../interfaces/IObject';

export interface User {
  id: number,
  username: string,
  password: string,
  role: string
};

class UserModel extends Model<User> {

  constructor() {
    super({
      username: {
        required: true
      },
      password: {
        required: true
      },
      role: {
        required: true
      }
    });
  }

  public format(data: IObject): User {
    return {
      id: data.id,
      username: data.username, 
      password: data.password,
      role: data.role
    };
  }

}

export const userModel = new UserModel();