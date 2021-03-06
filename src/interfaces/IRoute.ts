import express from 'express';

export default interface IRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  role?: string,
  verifyUserId?: boolean,
  func?: (req: express.Request, res: express.Response) => Promise<void> 
}