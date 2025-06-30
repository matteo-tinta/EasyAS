import * as jwtValidator from "jsonwebtoken"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ASJwtPayload } from "./models/ASJwtPayload";

export class JWT {
    static #instance: JWT;
    privateKey: NonSharedBuffer;
    publicKey: NonSharedBuffer;

    public static get instance() {
        if (!this.#instance) {
            this.#instance = new JWT();
        }

        return this.#instance;
    }

    constructor() {
        this.privateKey = fs.readFileSync(path.join(__dirname, "..", 'keys', 'private.key'));
        this.publicKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'public.key'));
    }

    public verifyAndDecode = (jwt: string): ASJwtPayload => {
        return jwtValidator.verify(jwt.trim(), this.publicKey, { algorithms: ['RS256'] }) as ASJwtPayload
    }

    public sign = (o: object): string => {
        return jwtValidator.sign(o, this.privateKey, { algorithm: 'RS256', expiresIn: 60 })
    }
}