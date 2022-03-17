import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class UserEntity extends Entity {
  constructor(data: IObject) {
    super(data, {
      username: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      },
      role: {
        type: 'string',
        default: 'user'
      }
    });
  }
}