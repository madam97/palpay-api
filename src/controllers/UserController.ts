import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';

export default class UserController extends Controller<UserEntity> {
  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new UserRepository(db);

    super.setRoutes();
  }
}