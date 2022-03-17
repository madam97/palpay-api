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

  public async findOneByUserId(userId: number): Promise<BankAccountEntity> {
    const result = await this.db.selectOne(`${this.NAME}/selectOneByUserId`, userId);
    return this.getEntity(result);
  }
}