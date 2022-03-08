import Entity from './Entity';

export default class BankAccountEntity extends Entity {
  id: number | null;
  accountNumber: string;
  balance: number;

  constructor(id: number | null = null, accountNumber: string, balance: number) {
    super();

    this.id = id;
    this.accountNumber = accountNumber;
    this.balance = balance;
  }
}