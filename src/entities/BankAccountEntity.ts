import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class BankAccountEntity extends Entity {
  constructor(data: IObject) {
    super(data, {
      accountNumber: {
        type: 'string',
        required: true,
        default: ''
      },
      balance: {
        type: 'number',
        required: false,
        default: 0
      }
    });
  }
}