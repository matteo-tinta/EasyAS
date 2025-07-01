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

    public async getAsync(filter: Filter<UserCollection>) {
        var result = await this.database.users.findOne(filter)
        var token = await this.database.tokens.findOne({ username: filter.username })

        if(!result) {
            return null;
        }

        return new User(
            result.username,
            result.password,
            !token ? null : new Token(result.username, token.refreshToken)
        )
    }

    public async upsertUser(user: User): Promise<User> {
        await this.database.users
            .findOneAndReplace(
                { username: user.username }, 
                { username: user.username, password: user.password },
                { upsert: true }
            )
        
        if(user.token)
        {
            var token = await this.database.tokens
                .findOneAndUpdate(
                    { username: user.username },
                    {
                        $set: {
                            refreshToken: user.token.refreshToken
                        }
                    },
                    {
                        upsert: true
                    }
                )
            
            if(!token) {
                throw new Error("Unable to store new refresh token")
            }
                
            return new User(
                user.username,
                user.password,
                new Token(user.username, token.refreshToken)
            );
        }

        return new User(
            user.username,
            user.password,
            null
        );
    }
}