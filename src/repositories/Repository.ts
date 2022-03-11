import Database from '../Database';
import Entity from '../entities/Entity';

export default abstract class Repository<T extends Entity> {
  [index: string]: any;
  
  protected NAME: string;
  protected db: Database;
  protected entityName: string;

  constructor(db: Database) {
    this.NAME = new.target.name.replace(/Repository$/i, '');
    this.db = db;
  }

  public abstract getEntity(data: object): T;

  public getEntitiesData(entities: T[]): object[] {
    const data: object[] = [];
    entities.map(entity => data.push( entity.toObject() ));
    return data;
  }

  public async find(): Promise<T[]> {
    const entities: T[] = [];

    const result = await this.db.select(`${this.NAME}/selectAll`);
    result.map(row => entities.push( this.getEntity(row) ));

    return entities;
  }

  public async findOne(id: number): Promise<T> {
    const result = await this.db.selectOne(`${this.NAME}/selectOne`, id);
    return this.getEntity(result);
  }

  public async create(entity: T): Promise<T> {
    entity.id = await this.db.insert(`${this.NAME}/insertOne`, entity.toArray(true));

    return entity;
  }

  public async update(entity: T): Promise<boolean> {
    return await this.db.update(`${this.NAME}/updateOne`, entity.toArray());
  }

  public async delete(id: number): Promise<boolean> {
    return await this.db.delete(`${this.NAME}/deleteOne`, id);
  }
}