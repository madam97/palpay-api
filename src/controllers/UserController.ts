import Database from '../Database';
import Controller from './Controller';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';

export default class UserController extends Controller<UserEntity> {
  constructor(db: Database) {
    super(db);
    this.repo = new UserRepository(db);

    super.setRoutes();
  }
}