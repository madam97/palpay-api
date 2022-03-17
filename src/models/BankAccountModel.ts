import Model from './Model';
import IObject from '../interfaces/IObject';

export interface BankAccount {
  id: number,
  accountNumber: string,
  balance: number
};


class BankAccountModel extends Model<BankAccount> {

  protected formatRow(row: IObject): BankAccount {
    return {
      id: row.id,
      accountNumber: row.account_number,
      balance: row.balance
    };
  }

}

export const bankAccountModel = new BankAccountModel();