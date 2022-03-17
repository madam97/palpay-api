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

  public async findOneByUserId(userId: number): Promise<UserInfoEntity> {
    const result = await this.db.selectOne(`${this.NAME}/selectOneByUserId`, userId);
    return this.getEntity(result);
  }
}