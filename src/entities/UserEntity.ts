import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class UserEntity extends Entity {
  constructor(data: IObject) {
    super(data, {
      userInfoId: {
        type: 'number',
        required: true,
      },
      bankAccountId: {
        type: 'number',
        required: true,
      },
      username: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    });
  }
}