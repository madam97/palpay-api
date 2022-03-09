import Database from '../Database';
import Repository from './Repository';
import BankAccountEntity from '../entities/BankAccountEntity';

export default class BankAccountRepository extends Repository<BankAccountEntity> {
  constructor(db: Database) {
    super(db);
  }

  public async find(): Promise<BankAccountEntity[]> {
    const entities: BankAccountEntity[] = [];

    const result = await this.db.select('BankAccount/selectAll');
    result.map(row => entities.push( new BankAccountEntity(row) ));

    return entities;
  }

  public async findOne(id: number): Promise<BankAccountEntity> {
    const result = await this.db.selectOne('BankAccount/selectOne', id);
    return new BankAccountEntity(result);
  }

  public async create(entity: BankAccountEntity): Promise<BankAccountEntity> {
    entity.id = await this.db.insert('BankAccount/insertOne', entity.toArrayNoId());

    return entity;
  }

  public async update(entity: BankAccountEntity): Promise<boolean> {
    return await this.db.update('BankAccount/updateOne', entity.toArray());
  }

  public async delete(id: number): Promise<boolean> {
    return await this.db.delete('BankAccount/deleteOne', id);
  }
}