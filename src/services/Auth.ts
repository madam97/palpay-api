import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
  readonly bcryptSaltRounds: number;

  constructor(secret: string, bcryptSaltRounds: number) {
    this.secret = secret;
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
   * Generates a JWT token using the given payload data
   * @param user
   * @returns 
   */
  public getToken(user: AuthUser): string {
    const payload: AuthPayload = {
      user
    };

    return jwt.sign(payload, this.secret);
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

    const payload = jwt.verify(token, this.secret);

    return { 
      user: typeof payload === 'string' ? {} : payload.user
    };
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
  process.env.AUTH_SECRET ?? 'secretkey', 
  process.env.AUTH_BCRYPT_SALT_ROUNDS ? parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS) : 10
);