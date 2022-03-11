import express from 'express';
import bcrypt from 'bcrypt';
import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';
import TAuthPayload from '../interfaces/IAuthPayload';

export default class UserController extends Controller<UserEntity> {
  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new UserRepository(db);

    super.setRoutes([
      {
        method: 'POST',
        path: '/login',
        func: this.login.bind(this)
      },
      {
        method: 'POST',
        path: '/logout',
        role: 'user',
        func: this.logout.bind(this)
      },
      {
        method: 'POST',
        path: '/refresh',
        role: 'user',
        func: this.refresh.bind(this)
      }
    ]);
  }

  private async login(req: express.Request, res: express.Response): Promise<void> {
    try {
      if (!req.body.username || !req.body.password) {
        throw new Error('username and password required');
      }

      // Get user
      const user = await this.repo.findByUsername(req.body.username);

      // Password check
      if (! await bcrypt.compare(req.body.password, user.password) ) {
        throw new Error('password is invalid');
      }

      // Get token
      const payload: TAuthPayload = {
        user: { id: 1, name: 'asd', role: 'user' }
      };
      const token = this.auth.login(payload);

      res.json({
        msg: 'login was successful',
        token
      });
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down list of entities',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  private async logout(req: express.Request, res: express.Response): Promise<void> {
    
  }

  private async refresh(req: express.Request, res: express.Response): Promise<void> {
    
  }
}