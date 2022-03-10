import Database from '../Database';
import Repository from './Repository';
import PaymentEntity from '../entities/PaymentEntity';

export default class PaymentRepository extends Repository<PaymentEntity> {
  constructor(db: Database) {
    super(db);
  }

  public getEntity(data: object): PaymentEntity {
    return new PaymentEntity(data);
  }
}