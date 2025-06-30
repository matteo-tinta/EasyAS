import { verify, sign } from "jsonwebtoken"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

    public valid = (jwt: string): boolean => {
        verify(jwt.trim(), this.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err)
            {
                throw err
            }

            console.dir({ decoded })
        })

        return true;
    }

    public sign = (o: object): string => {
        return sign(o, this.privateKey, { algorithm: 'RS256', expiresIn: 60 })
    }
}