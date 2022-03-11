import Database from '../Database';
import Repository from './Repository';
import UserEntity from '../entities/UserEntity';

export default class UserRepository extends Repository<UserEntity> {
  constructor(db: Database) {
    super(db);
  }

  public getEntity(data: object): UserEntity {
    return new UserEntity(data);
  }

  public async findByUsername(username: string): Promise<UserEntity> {
    const result = await this.db.selectOne(`${this.NAME}/selectOneByUsername`, username);
    return this.getEntity(result);
  }
}