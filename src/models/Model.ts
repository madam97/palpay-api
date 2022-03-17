import db from '../database';
import IObject from '../interfaces/IObject';

interface Entity {
  id: number
};

/**
 * Base model, use it to create models of a data
 */
export default abstract class Model<T extends Entity> {
  protected NAME: string;

  constructor() {
    this.NAME = new.target.name.replace(/Model$/i, '');
  }


  /// TRANSFORM METHODS

  /**
   * Transforms a row of a query result into an entity
   * @param row 
   */
  protected abstract formatRow(row: IObject): T;

  /**
   * Transforms the given entity into an array
   * @param entity 
   * @param noId If true, id will not be returned; good for insert query
   * @returns 
   */
  public toArray(entity: T, noId: boolean = false): any[] {
    const data: IObject = { ...entity };

    if (noId && data.id) {
      delete data.id;
    }

    return Object.values({ ...data });
  }

  /**
   * Transforms the given entity into an object; good for return entity in a HTTP response
   * @param entity 
   * @returns 
   */
  public toObject(entity: T): object {
    return { ...entity };
  }

  /**
   * Transforms the given array of entities into an array of objects; good for return entities in a HTTP response
   * @param entity 
   * @returns 
   */
  public toObjectArray(entities: T[]): object[] {
    const data: object[] = [];

    entities.map(entity => {
      data.push({ ...entity });
    });

    return data;
  }
  
  /**
   * Transforms multiple row of query result into array of entities
   * @param result 
   * @returns 
   */
  protected formatResult(result: IObject[]): T[] {
    const entities: T[] = [];

    result.map(row => {
      entities.push( this.formatRow(row) )
    });

    return entities;
  }


  /// OPERATION METHODS
  
  public async find(): Promise<T[]> {
    return this.formatResult( await db.select(`${this.NAME}/select`) );
  }

  public async findOne(id: number): Promise<T> {
    return this.formatRow( await db.selectOne(`${this.NAME}/selectOne`, id) );
  }

  public async findOneByUserId(id: number): Promise<T> {
    return this.formatRow( await db.selectOne(`${this.NAME}/selectOneByUserId`, id) );
  }

  public async create(entity: T): Promise<T> {
    entity.id = await db.insert(`${this.NAME}/insert`, this.toArray(entity, true));

    return entity;
  }

  public async update(entity: T): Promise<boolean> {
    return await db.update(`${this.NAME}/update`, this.toArray(entity));
  }

  public async delete(id: number): Promise<boolean> {
    return await db.delete(`${this.NAME}/delete`, id);
  }
}