import express from 'express';
import { auth, TAuthRole } from '../services/Auth';
import { Model, Entity } from '../models/Model';
import TMethod from '../types/TMethod';

export interface Route {
  method: TMethod,
  path: string,
  params?: string[],
  role?: TAuthRole,
  verifyUserId?: boolean,
  func?: Function
};

export class Controller<T extends Entity> {

  readonly router: express.Router;
  private routes: Route[] = [];
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.router = express.Router();
    this.model = model;
  }


  /// ROUTE METHODS

  /**
   * Saves and uses multiple routes' config
   * @param routes 
   */
  protected setRoutes(routes: Route[]) {
    routes.map(route => {
      this.addRoute(route);
    });
  }

  /**
   * Saves the route config and add a new express route using the config
   * @param route 
   */
  protected addRoute(route: Route): void {
    // Save route config
    route = this.formatRoute(route);
    this.routes.push(route);

    // Handlers
    const handlers: express.RequestHandler[] = [];
    if (route.role !== 'guest') {
      handlers.push( this.verifyAuth.bind(this) );
    }
    if (route.verifyUserId) {
      handlers.push( this.verifyUserId.bind(this) );
    }

    // Endpoint run with handlers
    if (handlers.length > 0) {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, ...handlers, this.runEndpoint.bind(this)); break;
        case 'POST':    this.router.post(route.path, ...handlers, this.runEndpoint.bind(this)); break;
        case 'PUT':     this.router.put(route.path, ...handlers, this.runEndpoint.bind(this)); break;
        case 'PATCH':   this.router.patch(route.path, ...handlers, this.runEndpoint.bind(this)); break;
        case 'DELETE':  this.router.delete(route.path, ...handlers, this.runEndpoint.bind(this)); break;
      }
    }
    
    // Endpoint run without handlers
    else {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, this.runEndpoint.bind(this)); break;
        case 'POST':    this.router.post(route.path, this.runEndpoint.bind(this)); break;
        case 'PUT':     this.router.put(route.path, this.runEndpoint.bind(this)); break;
        case 'PATCH':   this.router.patch(route.path, this.runEndpoint.bind(this)); break;
        case 'DELETE':  this.router.delete(route.path, this.runEndpoint.bind(this)); break;
      }
    }
  }

  /**
   * Returns the route config of the given method and path
   * @param method 
   * @param path 
   * @returns 
   */
  protected getRoute(method: string, path: string): Route {
    const route = this.routes.find(route => route.method === method && route.path === path);

    if (!route) {
      throw new Error(`Cannot ${method} ${path}`);
    }

    return route;
  }

  /**
   * Sets the values of undefined properties of the given route which have a default value
   * @param route 
   * @returns 
   */
  private formatRoute(route: Route): Route {
    if (!route.params) {
      route.params = [];
      const params = route.path.match(/:.*?(\/|\?|$)/g);

      if (params) {
        params.map(param => route.params?.push( param.replaceAll(/:|\//g, '') ));
      }
    }

    if (!route.role) {
      route.role = route.verifyUserId ? 'user' : 'guest';
    }

    if (!route.func) {
      switch (route.method) {
        case 'GET':     route.func = route.path === '/:id' ? this.getOne.bind(this) : this.get.bind(this); break;
        case 'POST':    route.func = this.post.bind(this); break;
        case 'PUT':     route.func = this.put.bind(this); break;
        case 'PATCH':   route.func = this.patch.bind(this); break;
        case 'DELETE':  route.func = this.delete.bind(this); break;
      }
    }

    return route;
  }



  /// REQUEST HANDLERS

  /**
   * Checks if user is logged in and has the needed role
   * @param req 
   * @param res 
   * @param next 
   */
  protected verifyAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
    try {
      const payload = auth.verifyAuth(req.headers);
      const route = this.getRoute(req.method, req.route.path);

      auth.verifyRole(route.role, payload.user.role);

      req.route = route;
      req.user = payload.user;

      next();
    } catch (err) {
      res.status(403).json({
        msg: err instanceof Error ? err.message : 'unknown error'
      });
    }
  }

  /**
   * Checks if the logged in user's id is the same as the request's id parameter
   * @param req 
   * @param res 
   * @param next 
   */
  protected verifyUserId(req: express.Request, res: express.Response, next: express.NextFunction): void {
    try {
      if (!req.user) {
        throw new Error('user has to login');
      } else if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
        throw new Error('logged user\'s id and id in path are different');
      }

      next();
    } catch (err) {
      res.status(403).json({
        msg: 'Forbidden',
        log: `Auth error: ${err instanceof Error ? err.message : 'unknown error'}`
      })
    }
  }

  

  /// ENDPOINTS METHODS

  /**
   * Runs the endpoint of the given request
   * @param req 
   * @param res 
   */
  protected async runEndpoint(req: express.Request, res: express.Response): Promise<void> {
    try {
      const route = this.getRoute(req.method, req.route.path);

      if (!route.func) {
        throw new Error(`${req.method} ${req.route.path} do not have function`);
      }

      const args = [];
      if (route.params) {
        route.params.map(param => args.push( parseInt(req.params[param]) ));
      }
      if (req.body) {
        args.push(req.body);
      }

      res.json( await route.func(...args) );
    } catch (err) {
      res.status(404).json({
        msg: err instanceof Error ? err.message : 'unknown error'
      });
    }
  }

  // GET /
  protected async get(): Promise<object[]> {
    return await this.model.find();
  }

  // GET /:id
  protected async getOne(id: number): Promise<object> {
    return await this.model.findOne(id);
  }

  // POST /
  protected async post(body: object): Promise<object> {
    const entity = this.model.format(body);

    return await this.model.create(entity);
  }

  // PUT /:id
  protected async put(id: number, body: object): Promise<object> {
    const entity = this.model.format({ ...body, id });

    await this.model.update(entity);

    return entity;
  }

  // PATCH /:id
  protected async patch(id: number, body: object): Promise<object> {
    const entity = await this.model.findOne(id);
    const newEntity = this.model.format({ ...entity, ...body, id });

    await this.model.update(newEntity);

    return newEntity;
  }

  // DELETE /:id
  protected async delete(id: number): Promise<object> {
    const entity = await this.model.findOne(id);
    
    await this.model.delete(id);

    return entity;
  }

}