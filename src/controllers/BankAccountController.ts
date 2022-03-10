import Database from '../Database';
import Controller from './Controller';
import BankAccountEntity from '../entities/BankAccountEntity';
import BankAccountRepository from '../repositories/BankAccountRepository';

export default class BankAccountController extends Controller<BankAccountEntity> {
  constructor(db: Database) {
    super(db);
    this.repo = new BankAccountRepository(db);

    super.setRoutes();
  }
}