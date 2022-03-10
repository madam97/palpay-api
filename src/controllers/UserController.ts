import express from 'express';
import Database from '../Database';
import controller from './Controller';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';

export default function userController(db: Database): express.Router {
  const repo = new UserRepository(db);

  const router = controller<UserEntity>(repo);

  return router;
}