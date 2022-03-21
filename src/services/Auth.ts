import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authConfig } from '../config';
import IObject from '../interfaces/IObject';

export type TAuthRole = 'guest' | 'user' | 'admin';

export interface AuthUser {
  id: number,
  name: string,
  role?: TAuthRole
};

export interface AuthPayload {
  user: AuthUser
};

export class Auth {
  private secret: string;
  private refreshTokenSecret: string;
  readonly bcryptSaltRounds: number;

  constructor(secret: string, refreshTokenSecret: string, bcryptSaltRounds: number) {
    this.secret = secret;
    this.refreshTokenSecret = refreshTokenSecret;
    this.bcryptSaltRounds = bcryptSaltRounds;
  }

  /**
   * Generates the hash of the given password using Bcrypt
   * @param password 
   * @returns 
   */
  public async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.bcryptSaltRounds); 
  }

  /**
   * Compares the given password and hash using Bcrypt
   * @param password 
   * @param hash 
   */
  public async verifyPassword(password: string, hash: string): Promise<void> {
    if (! await bcrypt.compare(password, hash) ) {
      throw new Error('password is invalid');
    }
  }

  /**
   * Generates a JWT access or refresh token using the given payload data
   * @param user
   * @param accessToken
   * @returns 
   */
  public getToken(user: AuthUser, accessToken: boolean = true): string {
    const payload: AuthPayload = {
      user
    };

    return accessToken ?
      jwt.sign(payload, this.secret, { expiresIn: '1h' }) :
      jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '1d' });
  }

  /**
   * Verifies the given JWT access or refresh token and returns its payload
   * @param token 
   * @param accessToken 
   * @returns 
   */
  public verifyToken(token: string, accessToken: boolean = true): AuthPayload {
    const payload = accessToken ?
      jwt.verify(token, this.secret) :
      jwt.verify(token, this.refreshTokenSecret);

    if (typeof payload === 'string' || !payload.user) {
      throw new Error('token payload is invalid');
    }

    return { 
      user: payload.user
    };
  }

  /**
   * Verifies the authorization header
   * @param headers 
   * @returns 
   */
  public verifyAuth(headers: IObject): AuthPayload {
    if (!headers['authorization']) {
      throw new Error('authorization header is missing');
    }

    const authHeader = headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('authorization header is invalid');
    }

    return this.verifyToken(token);
  }

  /**
   * Compares the given needed and user's role
   * @param neededRole 
   * @param role 
   */
  public verifyRole(neededRole: TAuthRole | undefined, role: TAuthRole | undefined): void {
    if (neededRole && neededRole !== 'guest' && role !== 'admin' && neededRole !== role) {
      throw new Error(`logged user do not have ${neededRole} role`);
    }
  }
}

export const auth = new Auth(
  authConfig.secret,
  authConfig.refreshSecret,
  authConfig.bcryptSaltRounds
);