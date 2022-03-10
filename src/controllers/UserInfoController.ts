import Database from '../Database';
import Controller from './Controller';
import UserInfoEntity from '../entities/UserInfoEntity';
import UserInfoRepository from '../repositories/UserInfoRepository';

export default class UserInfoController extends Controller<UserInfoEntity> {
  constructor(db: Database) {
    super(db);
    this.repo = new UserInfoRepository(db);

    super.setRoutes();
  }
}