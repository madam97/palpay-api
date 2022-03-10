import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class PaymentEntity extends Entity {
  constructor(data: IObject) {
    super(data, {
      fromBankAccountId: {
        type: 'number',
        required: true
      },
      toBankAccountId: {
        type: 'number',
        required: true
      },
      amount: {
        type: 'number',
        required: true
      },
      notice: {
        type: 'string',
        required: false
      },
      createdAt: {
        type: 'Date',
        required: true
      }
    });
  }
}