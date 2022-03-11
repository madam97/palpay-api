import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import UserInfoEntity from '../entities/UserInfoEntity';
import UserInfoRepository from '../repositories/UserInfoRepository';

export default class UserInfoController extends Controller<UserInfoEntity> {
  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new UserInfoRepository(db);

    super.setRoutes();
  }
}