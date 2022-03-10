import express from 'express';
import Database from '../Database';
import controller from './Controller';
import UserInfoEntity from '../entities/UserInfoEntity';
import UserInfoRepository from '../repositories/UserInfoRepository';

export default function userInfoController(db: Database): express.Router {
  const repo = new UserInfoRepository(db);

  const router = controller<UserInfoEntity>(repo);

  return router;
}