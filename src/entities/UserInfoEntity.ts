import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class UserInfoEntity extends Entity {
  constructor(data: IObject) {
    super(data, {
      userId: {
        type: 'number',
        required: true,
      },
      name: {
        type: 'string',
        required: true
      },
      address: {
        type: 'string',
        required: true
      },
      telephone: {
        type: 'string',
        required: true
      },
      email: {
        type: 'string',
        required: true
      }
    });
  }
}