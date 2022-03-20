import { Model } from './Model';
import db from '../database';
import IObject from '../interfaces/IObject';

export interface BankAccount {
  id: number,
  userId: number,
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
      userId: data.user_id ?? data.userId,
      accountNumber: data.account_number ?? data.accountNumber,
      balance: data.balance
    };
  }
  

  
  /// OPERATION METHODS

  public async findOneByAccountNumber(AccountNumber: string): Promise<BankAccount> {
    return this.format( await db.selectOne(`${this.NAME}/selectOneByAccountNumber`, AccountNumber) );
  }

}

export const bankAccountModel = new BankAccountModel();