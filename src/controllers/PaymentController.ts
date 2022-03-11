import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import PaymentEntity from '../entities/PaymentEntity';
import PaymentRepository from '../repositories/PaymentRepository';

export default class PaymentController extends Controller<PaymentEntity> {
  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new PaymentRepository(db);

    super.setRoutes();
  }
}