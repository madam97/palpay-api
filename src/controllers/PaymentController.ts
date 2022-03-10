import Database from '../Database';
import Controller from './Controller';
import PaymentEntity from '../entities/PaymentEntity';
import PaymentRepository from '../repositories/PaymentRepository';

export default class PaymentController extends Controller<PaymentEntity> {
  constructor(db: Database) {
    super(db);
    this.repo = new PaymentRepository(db);

    super.setRoutes();
  }
}