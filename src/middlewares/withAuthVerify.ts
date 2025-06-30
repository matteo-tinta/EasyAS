import { Request, Response, NextFunction} from 'express';
import { DB } from '../infrastructure/persitence/db';
import { raise } from '../raise';
import { JWT } from '../jwt/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';

export default async (req: Request, res: Response, next: NextFunction) => {
  
    var [, token] = req.headers["authorization"]?.split("Bearer") || []
    if(!token) {
        res.status(401).send({ ok: false, reason: "empty authorization" })
        return;
    }

    try {
        req.user = JWT.instance.verifyAndDecode(token)
    } catch (error) {
        console.error(error)
        if(error instanceof JsonWebTokenError) {
            res.status(401).send({ ok: false, reason: error.message })
            return;
        }

        throw error;
    }

    next()
}