import Entity from './Entity';
import IObject from '../interfaces/IObject';

export default class BankAccountEntity extends Entity {
  id: number | null;
  accountNumber: string;
  balance: number;

  constructor(data: IObject) {
    super();

    this.id = data.id ?? null;
    this.accountNumber = data.accountNumber ?? '';
    this.balance = data.balance ?? 0;
  }

  static get NAME() { return 'BankAccount'; }

  public toArray(): any[] {
    return [this.accountNumber, this.balance, this.id];
  }

  public toArrayNoId(): any[] {
    return [this.accountNumber, this.balance];
  }
}