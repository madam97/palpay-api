import express from 'express';
import TMethod from '../types/TMethod';

export interface Route {
  method: TMethod,
  path: string,
  role?: string,
  verifyUserId?: boolean,
  func: Function
};

export class Controller {

  readonly router: express.Router;
  private routes: Route[];

  constructor() {
    this.router = express.Router();
  }

  protected async runRoute(req: express.Request, res: express.Response): Promise<void> {
    try {
      const route = this.getRoute(req.method, req.route.path);

      const args = [];
      if (req.params.id) {
        args.push( parseInt(req.params.id) ); 
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

  protected setRoutes(routes: Route[]) {
    this.routes = routes;

    this.routes.map(route => {
      this.setRoute(route);
    });
  }

  protected setRoute(route: Route): void {
    const handlers: express.RequestHandler[] = [];
    // if (route.role) {
    //   handlers.push( this.verifyRoute.bind(this) );
    // }
    // if (route.verifyUserId) {
    //   handlers.push( this.verifyUserId.bind(this) );
    // }

    if (handlers.length > 0) {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, ...handlers, this.runRoute.bind(this)); break;
        case 'POST':    this.router.post(route.path, ...handlers, this.runRoute.bind(this)); break;
        case 'PUT':     this.router.put(route.path, ...handlers, this.runRoute.bind(this)); break;
        case 'PATCH':   this.router.patch(route.path, ...handlers, this.runRoute.bind(this)); break;
        case 'DELETE':  this.router.delete(route.path, ...handlers, this.runRoute.bind(this)); break;
      }
    } else {
      switch (route.method) {
        case 'GET':     this.router.get(route.path, this.runRoute.bind(this)); break;
        case 'POST':    this.router.post(route.path, this.runRoute.bind(this)); break;
        case 'PUT':     this.router.put(route.path, this.runRoute.bind(this)); break;
        case 'PATCH':   this.router.patch(route.path, this.runRoute.bind(this)); break;
        case 'DELETE':  this.router.delete(route.path, this.runRoute.bind(this)); break;
      }
    }
  }

  protected getRoute(method: string, path: string): Route {
    const route = this.routes.find(route => route.method === method && route.path === path);

    if (!route) {
      throw new Error(`Cannot ${method} ${path}`);
    }

    return route;
  }

}