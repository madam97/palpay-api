import Database from '../Database';
import Repository from './Repository';
import BankAccountEntity from '../entities/BankAccountEntity';

export default class BankAccountRepository extends Repository<BankAccountEntity> {
  constructor(db: Database) {
    super(db);
  }

  public getEntity(data: object): BankAccountEntity {
    return new BankAccountEntity(data);
  }
}