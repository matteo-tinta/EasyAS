import { Request, Response, NextFunction} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { container } from '../dependiencies';
import { JwtService } from '../core/services/jwt.service';

export default async (req: Request, res: Response, next: NextFunction) => {
  
    var [, token] = req.headers["authorization"]?.split("Bearer") || []
    if(!token) {
        res.status(401).send({ ok: false, reason: "empty authorization" })
        return;
    }

    
    try {
        var service = await container.getAsync(JwtService)
        req.user = service.verifyAndDecode(token);
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