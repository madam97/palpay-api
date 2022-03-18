import Model from './Model';
import IObject from '../interfaces/IObject';

export interface BankAccount {
  id: number,
  accountNumber: string,
  balance: number
};


class BankAccountModel extends Model<BankAccount> {

  constructor() {
    super({
      userId: {
        required: true
      },
      accountNumber: {
        required: true
      },
      balance: {
        required: true
      }
    });
  }

  public format(data: IObject): BankAccount {
    return {
      id: data.id,
      accountNumber: data.account_number ? data.account_number : data.accountNumber,
      balance: data.balance
    };
  }

}

export const bankAccountModel = new BankAccountModel();