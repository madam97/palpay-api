import express from 'express';
import Database from '../Database';
import Auth from '../services/Auth';
import Controller from './Controller';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';
import UserInfoRepository from '../repositories/UserInfoRepository';
import BankAccountRepository from '../repositories/BankAccountRepository';

export default class UserController extends Controller<UserEntity> {
  private repoUserInfo: UserInfoRepository;
  private repoBankAccount: BankAccountRepository;

  constructor(db: Database, auth: Auth) {
    super(db, auth);
    this.repo = new UserRepository(db);
    this.repoUserInfo = new UserInfoRepository(db);
    this.repoBankAccount = new BankAccountRepository(db);

    super.setRoutes([
      {
        method: 'GET',
        path: '/:id',
        role: 'user',
        verifyUserId: true
      },
      {
        method: 'GET',
        path: '/:id/user-info',
        role: 'user',
        verifyUserId: true,
        func: this.getOneUserInfo.bind(this)
      },
      {
        method: 'PUT',
        path: '/:id/user-info',
        role: 'user',
        func: this.putUserInfo.bind(this)
      },
      {
        method: 'GET',
        path: '/:id/bank-account',
        role: 'user',
        verifyUserId: true,
        func: this.getOneBankAccount.bind(this)
      },
      // {
      //   method: 'GET',
      //   path: '/:id/partners',
      //   role: 'user'
      // }
    ]);
  }

  // GET /users/:id/user-info
  private async getOneUserInfo(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const entity = await this.repoUserInfo.findOneByUserId(id);

      res.json( entity.toObject() );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // PUT /user/:id/user-info
  private async putUserInfo(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const entity = await this.repoUserInfo.findOneByUserId(id);

      req.body

      const newEntity = this.repo.getEntity({
        ...entity,
        ...req.body
      });

      entity.validate();

      await this.repoUserInfo.update(newEntity);

      res.json( newEntity.toObject() );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask update the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // GET /users/:id/bank-account
  private async getOneBankAccount(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const entity = await this.repoBankAccount.findOneByUserId(id);

      res.json( entity.toObject() );
    } catch (err) {
      res.status(400).json({
        msg: 'Not able to ask down the entity',
        log: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}