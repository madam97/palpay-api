import express from 'express';
import Database from '../Database';
import controller from './Controller';
import PaymentEntity from '../entities/PaymentEntity';
import PaymentRepository from '../repositories/PaymentRepository';

export default function paymentController(db: Database): express.Router {
  const repo = new PaymentRepository(db);

  const router = controller<PaymentEntity>(repo);

  return router;
}