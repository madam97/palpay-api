import express from 'express';
import Database from '../Database';
import Entity from '../entities/Entity';
import Repository from '../repositories/Repository';

export default class Controller<T extends Entity> {

  protected db: Database;
  protected repo: Repository<T>;
  readonly router: express.Router;

  constructor(db: Database) {
    this.db = db;
    this.router = express.Router();
  }

  protected setRoutes() {
    // GET /entity/
    this.router.get('/', async (req, res) => {
      try {
        const entities = await this.repo.find();

        res.json( this.repo.getEntitiesData(entities) );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to ask down list of entities',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });

    // GET /entity/:id
    this.router.get('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const entity = await this.repo.findOne(id);

        res.json( entity.toObject() );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to ask down the entity',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });

    // POST /entity/
    this.router.post('/', async (req, res) => {
      try {
        const entity = this.repo.getEntity(req.body);

        entity.validate(true, false);
        
        const newEntity = await this.repo.create(entity);

        res.json( newEntity.toObject() );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to create new entity',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });

    // PUT /entity/:id
    this.router.put('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const entity = this.repo.getEntity({
          ...req.body,
          id
        });

        entity.validate();

        await this.repo.update(entity);

        res.json( entity.toObject() );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to update all data of the entity',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });

    // PATCH /entity/:id
    this.router.patch('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const entity = await this.repo.findOne(id);

        const newEntity = this.repo.getEntity({
          ...entity,
          ...req.body
        });

        entity.validate();

        await this.repo.update(newEntity);

        res.json( newEntity.toObject() );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to ask update the entity',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });

    // DELETE /entity/:id
    this.router.delete('/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);

        res.json( await this.repo.delete(id) );
      } catch (err) {
        res.status(400).json({
          msg: 'Not able to delete the entity',
          log: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });
  }
}