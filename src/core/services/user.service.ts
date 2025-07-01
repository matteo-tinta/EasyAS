import { inject, injectable } from "inversify";
import { randomBytes } from "crypto";
import { JWT } from "../../jwt/jwt";
import { UserRepository } from "../../infrastructure/persitence/user/user.repository";
import { User } from "../../domain/user/user.domain";

@injectable("Request")
export class UserService {

    constructor(@inject(UserRepository) private userRepository: UserRepository) {
        
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

        const user = await this.userRepository.getAsync({ username: username, password: password })

        if(!user) {
            throw new Error("Credentials invalid")
        }
        
        const refreshToken = this.generateRefreshToken()
        user.addToken(refreshToken);
        
        //update refresh token in the database
        this.userRepository.upsertUser(user);
        
        const accessToken = JWT.instance.sign({user: username})
        return {
            token: accessToken,
            refreshToken: refreshToken
        }
    }

    public registerUserAsync = async (options: {
        username: string,
        password: string,
    }) => {
        const {
            username,
            password
        } = options

        const user = await this.userRepository.upsertUser(new User(username, password, []))

        if(!user) {
            throw new Error("Unable to create a new user")
        }
        
        return true;
    }

    public revokeAllTokens = async (username: string) => {
        const user = await this.userRepository.getAsync({ username: username })

        if(!user) {
            throw new Error("User does not exist")
        }

        user.revokeAllTokens();

        return await this.userRepository.upsertUser(user);
    }
}