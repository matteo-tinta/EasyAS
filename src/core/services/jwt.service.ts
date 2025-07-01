import { injectable } from "inversify";
import path from "path";
import * as jwtValidator from "jsonwebtoken"
import fs from 'fs';

export type ASJwtPayload = {
    user: string
}

@injectable()
export class JwtService {

    privateKey: NonSharedBuffer;
    publicKey: NonSharedBuffer;

    constructor() {
        this.privateKey = fs.readFileSync(path.join(__dirname, "..", "..", 'keys', 'private.key'));
        this.publicKey = fs.readFileSync(path.join(__dirname, '..', "..", 'keys', 'public.key'));
    }

    public verifyAndDecode = (jwt: string): ASJwtPayload => {
        return jwtValidator.verify(jwt.trim(), this.publicKey, { algorithms: ['RS256'] }) as ASJwtPayload
    }

    public sign = (o: object): string => {
        return jwtValidator.sign(o, this.privateKey, { algorithm: 'RS256', expiresIn: 60 })
    }
}