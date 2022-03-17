import jwt from 'jsonwebtoken';
import IAuthPayload from '../interfaces/IAuthPayload';

export default class Auth {
  private SECRET: string;
  readonly BCRYPT_SALT_ROUNDS: number;
  private config: object;

  constructor(SECRET: string, BCRYPT_SALT_ROUNDS: number, config: object = {}) {
    this.SECRET = SECRET;
    this.BCRYPT_SALT_ROUNDS = BCRYPT_SALT_ROUNDS;
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

  public verifyRole(neededRole: string | undefined, userRole: string | undefined): void {
    if (neededRole && neededRole !== 'guest' && userRole !== 'admin' && neededRole !== userRole) {
      throw new Error(`logged user do not have ${neededRole} role`);
    }
  }
}