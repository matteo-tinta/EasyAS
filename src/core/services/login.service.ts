import { inject, injectable } from "inversify";
import { randomBytes } from "crypto";
import { JWT } from "../../jwt/jwt";
import { Database } from "../../infrastructure/persitence/database";

@injectable("Request")
export class LoginService {

    constructor(@inject(Database) private database: Database) {
        
    }

    private generateRefreshToken = () => randomBytes(32).toString('hex')

    public loginUserAndGetTokensAsync = async (options: {
        username: string,
        password: string,
    }) => {
        const {
            username,
            password
        } = options

        const result = await this.database.users
            .find({ username: username, password: password })
            .toArray()

        if(!result.length) {
            throw new Error("Credentials invalid")
        }

        var accessToken = JWT.instance.sign({user: username})
        var refreshToken = this.generateRefreshToken();

        //update refresh token in the database
        this.database.tokens.insertOne({
            username: username,
            refreshToken: refreshToken,
            expireAt: new Date(new Date().getTime() + 60 * 60 * 1000) //expire in 1h
        });

        return {
            token: accessToken,
            refreshToken: refreshToken
        }
    }
}