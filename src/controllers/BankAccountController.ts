import express from 'express';
import Database from '../Database';
import controller from './Controller';
import BankAccountEntity from '../entities/BankAccountEntity';
import BankAccountRepository from '../repositories/BankAccountRepository';

export default function bankAccountController(db: Database): express.Router {
  const repo = new BankAccountRepository(db);

  const router = controller<BankAccountEntity>(repo);

  return router;
}