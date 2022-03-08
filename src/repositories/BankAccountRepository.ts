import Database from '../Database';
import BankAccountEntity from '../entities/BankAccountEntity';

export default class BankAccountRepository {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public find() {

  }

  // public findOne(id: number): object {
  //   let entity: object;

  //   this.db.exec('BankAccount/selectOne', [id], (result) => {
  //     entity = result;
  //   });

  //   return entity;
  // }

  public create(entity: BankAccountEntity): boolean {
    let done = false;

    this.db.exec('BankAccount/insertOne', entity.toArray(), (result) => {
      console.log(result);
      done = true;
    });

    return done;
  }

  public update(id: string, entity: BankAccountEntity): boolean {
    return true;
  }

  public delete(id: number): boolean {
    let done = false;

    this.db.exec('BankAccount/deleteOne', [id], (result) => {
      console.log(result);
      done = true;
    });

    return done;
  }
}