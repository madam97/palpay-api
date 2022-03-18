import db from '../database';
import IObject from '../interfaces/IObject';
import TMethod from '../types/TMethod';

export interface Entity {
  id: number
};

/**
 * Base model, use it to create models of a data
 */
export abstract class Model<T extends Entity> {
  protected NAME: string;
  protected props: IObject;

  constructor(props: IObject) {
    this.NAME = new.target.name.replace(/Model$/i, '');

    this.setProps(props);
  }

  /**
   * Sets the config of entity's properties
   * @param props 
   */
  private setProps(props: IObject): void {
    this.props = {
      id: {
        required: true,
        id: true,
      },
      ...props
    }
  }


  /// TRANSFORM METHODS

  /**
   * Transforms the given data into an entity
   * @param data 
   */
  public abstract format(data: IObject): T;
  
  /**
   * Transforms the given data array into array of entities
   * @param dataArray
   * @returns 
   */
  public formatArray(dataArray: IObject[]): T[] {
    const entities: T[] = [];

    dataArray.map(data => {
      entities.push( this.format(data) )
    });

    return entities;
  }

  /**
   * Transforms the given entity into an array
   * @param entity 
   * @param noId If true, id will not be returned; good for insert query
   * @returns 
   */
  public toArray(entity: T, noId: boolean = false): any[] {
    const entityObject: IObject = { ...entity };
    const data: any[] = [];
    let id: number = 0;

    for (const [key, prop] of Object.entries(this.props)) {
      if (prop.id) {
        id = entityObject[key];
      } else {
        data.push(entityObject[key]);
      }
    }

    if (!noId && id) {
      data.push(id);
    }

    return data;
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
   * Validates the given entity data based on which method is been used
   * @param entity 
   * @param method 
   */
  public validate(entity: T, method: TMethod) {
    const data: IObject = { ...entity };

    for (const [key, prop] of Object.entries(this.props)) {
      // id required
      if ((method === 'PUT' || method === 'PATCH') && prop.id && !data[key]) {
        throw new Error(`ID is missing ID in ${this.NAME} entity`);
      }
      // required
      else if (!prop.id && prop.required && !data[key]) {
        throw new Error(`'${key}' is missing in ${this.NAME} entity`);
      }
    }
  }


  /// OPERATION METHODS
  
  public async find(): Promise<T[]> {
    return this.formatArray( await db.select(`${this.NAME}/select`) );
  }

  public async findOne(id: number): Promise<T> {
    return this.format( await db.selectOne(`${this.NAME}/selectOne`, id) );
  }

  public async findOneByUserId(id: number): Promise<T> {
    return this.format( await db.selectOne(`${this.NAME}/selectOneByUserId`, id) );
  }

  public async create(entity: T): Promise<T> {
    this.validate(entity, 'POST');

    entity.id = await db.insert(`${this.NAME}/insert`, this.toArray(entity, true));

    return entity;
  }

  public async update(entity: T): Promise<boolean> {
    this.validate(entity, 'PUT');

    return await db.update(`${this.NAME}/update`, this.toArray(entity));
  }

  public async delete(id: number): Promise<boolean> {
    return await db.delete(`${this.NAME}/delete`, id);
  }
}