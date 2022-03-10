import jwt from 'jsonwebtoken';

export default class Auth {
  private SECRET: string;
  private config: object;

  constructor(SECRET: string, config: object = {}) {
    this.SECRET = SECRET;
    this.config = config;
  }

  public login(payload: object): string {
    return jwt.sign(payload, this.SECRET, this.config);
  }

  public verifyToken(authHeader: string): string | jwt.JwtPayload {
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('authorization header is missing');
    }

    const payload = jwt.verify(token, this.SECRET);

    return payload;
  }
}