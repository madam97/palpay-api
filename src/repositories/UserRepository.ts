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
}