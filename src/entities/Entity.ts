export default class Entity {
  private entityName: string;

  constructor() {
    this.entityName = new.target.name.replace(/Entity$/i, '');
  }

  public getEntityName(): string {
    return this.entityName;  
  }
}