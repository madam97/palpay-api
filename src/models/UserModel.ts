import { Model } from './Model';
import db from '../database';
import { TAuthRole } from '../services/Auth';
import IObject from '../interfaces/IObject';

export interface User {
  id: number,
  username: string,
  password: string,
  role: TAuthRole,
  refreshToken?: string | null
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
      },
      refreshToken: {
        required: false
      }
    });
  }

  public format(data: IObject): User {
    return {
      id: data.id,
      username: data.username, 
      password: data.password,
      role: data.role,
      refreshToken: data.refreshToken
    };
  }
  

  
  /// OPERATION METHODS

  public async findOneByUsername(username: string): Promise<User> {
    return this.format( await db.selectOne(`${this.NAME}/selectOneByUsername`, username) );
  }

}

export const userModel = new UserModel();