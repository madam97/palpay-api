import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import BankAccountEntity from '../entities/BankAccountEntity';
import BankAccountRepository from '../repositories/BankAccountRepository';

export default class BankAccountController extends Controller<BankAccountEntity> {
  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new BankAccountRepository(db);

    super.setRoutes();
  }
}