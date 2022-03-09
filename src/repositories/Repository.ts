import Database from '../Database';

export default abstract class Repository<T> {
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public abstract find(): Promise<T[]>;

  public abstract findOne(id: number): Promise<T>;

  public abstract create(entity: T): Promise<T>;

  public abstract update(entity: T): Promise<boolean>;

  public abstract delete(id: number): Promise<boolean>;
}