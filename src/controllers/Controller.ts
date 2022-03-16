import express from 'express';
import Database from '../Database';
import Auth from '../services/Auth';
import Entity from '../entities/Entity';
import Repository from '../repositories/Repository';
import IRoute from '../interfaces/IRoute';


export default class Controller<T extends Entity> {

  protected db: Database;
  protected auth: Auth;
  protected repo: Repository<T>;
  protected routes: IRoute[];
  readonly router: express.Router;

  constructor(db: Database, auth: Auth) {
    this.db = db;
    this.auth = auth;
    this.router = express.Router();
  }

  protected verifyToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
    try {
      if (!req.headers['authorization']) {
        throw new Error('authorization header is missing');
      }

      const payload = this.auth.verifyToken(req.headers['authorization']);

      let neededRole = this.getRoute(req.method, req.route.path).role;
      if (neededRole && neededRole !== payload.user.role) {
        throw new Error(`logged user do not have ${neededRole} role`);
      }

      req.user = payload.user;

      next();
    } catch (err) {
      res.status(403).json({
        msg: 'Forbidden',
        log: `Auth error: ${err instanceof Error ? err.message : 'unknown error'}`
      })
    }
  }

  // GET /entity/
  protected async get(req: express.Request, res: express.Response): Promise<void> {
    try {
      const entities = await this.repo.find();

      res.json( this.repo.getEntitiesData(entities) );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down list of entities',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // GET /entity/:id
  protected async getOne(req: express.Request, res: express.Response): Promise<void> {
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
  }

  // POST /entity/
  protected async post(req: express.Request, res: express.Response): Promise<void> {
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
  }

  // PUT /entity/:id
  protected async put(req: express.Request, res: express.Response): Promise<void> {
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
  }

  // PATCH /entity/:id
  protected async patch(req: express.Request, res: express.Response): Promise<void> {
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
  }

  // DELETE /entity/:id
  protected async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      res.json( await this.repo.delete(id) );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to delete the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  protected setRoutes(routes?: IRoute[]) {
    if (!routes || routes.length === 0) {
      routes = [
        {
          method: 'GET',
          path: '/'
        },
        {
          method: 'GET',
          path: '/:id'
        },
        {
          method: 'POST',
          path: '/',
        },
        {
          method: 'PATCH',
          path: '/:id'
        },
        {
          method: 'PUT',
          path: '/:id'
        },
        {
          method: 'DELETE',
          path: '/:id'
        }
      ];
    }
    this.routes = routes;

    this.routes.map(route => {
      this.setRoute(route);
    });
  }

  protected setRoute(route: IRoute): void {
    if (!route.func) {
      switch (route.method) {
        case 'GET':     route.func = route.path === '/:id' ? this.getOne.bind(this) : this.get.bind(this); break;
        case 'POST':    route.func = this.post.bind(this); break;
        case 'PUT':     route.func = this.put.bind(this); break;
        case 'PATCH':   route.func = this.patch.bind(this); break;
        case 'DELETE':  route.func = this.delete.bind(this); break;
      }
    }

    if (route.role) {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, this.verifyToken.bind(this), route.func); break;
        case 'POST':    this.router.post(route.path, this.verifyToken.bind(this), route.func); break;
        case 'PUT':     this.router.put(route.path, this.verifyToken.bind(this), route.func); break;
        case 'PATCH':   this.router.patch(route.path, this.verifyToken.bind(this), route.func); break;
        case 'DELETE':  this.router.delete(route.path, this.verifyToken.bind(this), route.func); break;
      }
    } else {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, route.func); break;
        case 'POST':    this.router.post(route.path, route.func); break;
        case 'PUT':     this.router.put(route.path, route.func); break;
        case 'PATCH':   this.router.patch(route.path, route.func); break;
        case 'DELETE':  this.router.delete(route.path, route.func); break;
      }
    }
  }

  protected getRoute(method: string, path: string): IRoute {
    const route = this.routes.find(route => route.method === method && route.path === path);

    if (!route) {
      throw new Error(`Controller error: there is no route for ${method} - ${path}`);
    }

    return route;
  }
}