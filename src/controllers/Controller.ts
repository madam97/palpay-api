import express from 'express';
import Repository from '../repositories/Repository';

export default function controller<T>(repo: Repository<T>): express.Router {
  const router = express.Router();

  // GET /entity/
  router.get('/', async (req, res) => {
    try {
      const entities = await repo.find();

      res.json(entities);
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down list of entities',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // GET /entity/:id
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entity = await repo.findOne(id);

      res.json(entity);
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // POST /entity/
  router.post('/', async (req, res) => {
    try {
      const entity = repo.getEntity(req.body);

      res.json( await repo.create(entity) );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to create new entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // PUT /entity/:id
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entity = repo.getEntity({
        ...req.body,
        id
      });

      await repo.update(entity)

      res.json(entity);
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to update all data of the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // PATCH /entity/:id
  router.patch('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entity = await repo.findOne(id);

      const newEntity = repo.getEntity({
        ...entity,
        ...req.body
      });

      await repo.update(newEntity);

      res.json(newEntity);
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask update the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // DELETE /entity/:id
  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      res.json( await repo.delete(id) );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to delete the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  return router;
}