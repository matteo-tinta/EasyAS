import { Jwt, JwtPayload } from 'jsonwebtoken';
import { ASJwtPayload } from '../jwt/models/ASJwtPayload';

declare global {
  namespace Express {
    interface Request {
      user?: ASJwtPayload;
    }
  }
}