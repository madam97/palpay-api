import jwt from 'jsonwebtoken';
import IAuthPayload from '../interfaces/IAuthPayload';

export default class Auth {
  private SECRET: string;
  private config: object;

  constructor(SECRET: string, config: object = {}) {
    this.SECRET = SECRET;
    this.config = config;
  }

  public login(payload: IAuthPayload): string {
    return jwt.sign(payload, this.SECRET, this.config);
  }

  public verifyToken(authHeader: string): IAuthPayload {
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('authorization header is missing');
    }

    const payload = jwt.verify(token, this.SECRET);

    return { 
      user: typeof payload === 'string' ? {} : payload.user
    };
  }
}