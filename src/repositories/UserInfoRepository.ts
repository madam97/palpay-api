import Database from '../Database';
import Repository from './Repository';
import UserInfoEntity from '../entities/UserInfoEntity';

export default class UserInfoRepository extends Repository<UserInfoEntity> {
  constructor(db: Database) {
    super(db);
  }

  public getEntity(data: object): UserInfoEntity {
    return new UserInfoEntity(data);
  }
}