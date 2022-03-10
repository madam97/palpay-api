import IObject from '../interfaces/IObject';

export default abstract class Entity {
  [index: string]: any;

  protected NAME: string;
  protected propertyConfig: IObject;
  private propertyTypes: string[] = ['number','string','boolean'];
  public id: any;

  constructor(data: IObject, propertyConfig: IObject) {
    this.NAME = new.target.name.replace(/Entity$/i, '');
    this.setPropertyConfig(propertyConfig);
    this.setProperties(data);

    this.validate(false, false);
  }

  private setPropertyConfig(propertyConfig: IObject): void {
    this.propertyConfig = {
      id: {
        type: 'number',
        required: true,
        id: true,
      },
      ...propertyConfig
    }

    for (const [key, config] of Object.entries(this.propertyConfig)) {
      if (!config.type) {
        throw new Error(`${this.NAME} entity error: '${key}' is missing property type`);
      } else if (!this.propertyTypes.includes(config.type)) {
        throw new Error(`${this.NAME} entity error: '${key}' is invalid property type`);
      }
    }
  }

  private setProperties(data: IObject): void {
    for (const [key, config] of Object.entries(this.propertyConfig)) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
      // default
      else if (config.default) {
        this[key] = config.default;
      }
    }
  }

  public validate(strict: boolean = true, idRequired: boolean = true): void {
    for (const [key, config] of Object.entries(this.propertyConfig)) {
      // id required
      if (idRequired && config.id && !this[key]) {
        throw new Error(`${this.NAME} entity error: ID is required`);
      }
      // required
      else if (strict && !config.id && config.required && !this[key]) {
        throw new Error(`${this.NAME} entity error: '${key}' is required`);
      }
      // type
      else if (this[key] !== null && this[key] !== undefined && typeof this[key] !== config.type) {
        throw new Error(`${this.NAME} entity error: '${key}' has to be ${config.type}`);
      }
    }
  }

  public toObject(): IObject {
    const data: IObject = {};

    for (const key in this.propertyConfig) {
      data[key] = this[key];
    }

    return data;
  }

  public toArray(noId: boolean = false): any[] {
    const data: any[] = [];
    let idProperty: string = '';

    for (const [key, config] of Object.entries(this.propertyConfig)) {
      if (config.id) {
        idProperty = key;
      } else {
        data.push(this[key]);
      }
    }

    if (!noId && idProperty) {
      data.push(this[idProperty]);
    }

    return data;
  }
}