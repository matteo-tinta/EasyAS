import { inject, injectable } from "inversify";
import { Database, UserCollection } from "../database";
import { User } from "../../../domain/user/user.domain";
import { Token } from "../../../domain/token/token.domain";
import { Filter } from "mongodb";


@injectable()
export class UserRepository {
    
    

    constructor(
        @inject(Database) private database: Database
    ) {
        
    }

    public async getByRefreshTokenAsync(refreshToken: string) {
        var tokens = await this.database.tokens.find({ refreshToken: refreshToken }).toArray()

        if(!tokens?.length) {
            return null;
        }

        var user = await this.database.users.findOne({ username: tokens[0].username })

        if(!user) {
            return null;
        }

        return new User(
            user.username,
            user.password,
            !tokens?.length ? [] : tokens.map(t => new Token(user!.username, t.refreshToken, t.expiredAt))
        )
    }

    public async getAsync(filter: Filter<UserCollection>) {
        var result = await this.database.users.findOne(filter)
        var tokens = await this.database.tokens.find({ username: filter.username }).toArray()

        if(!result) {
            return null;
        }

        return new User(
            result.username,
            result.password,
            !tokens?.length ? [] : tokens.map(t => new Token(result!.username, t.refreshToken, t.expiredAt))
        )
    }

    public async upsertUser(user: User): Promise<User> {
        await this.database.users
            .findOneAndReplace(
                { username: user.username }, 
                { username: user.username, password: user.password },
                { upsert: true }
            )
        
        await this.database.tokens.deleteMany({ username: user.username })
            
        if(user.tokens.length)
        {
            const tokens = await this.database.tokens.insertMany(user.tokens)

            if(!tokens) {
                throw new Error("Unable to store new refresh token")
            }
        }
        

        return new User(
            user.username,
            user.password,
            user.tokens
        );
    }
}