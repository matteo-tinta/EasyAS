import { inject, injectable } from "inversify";
import { randomBytes } from "crypto";
import { JWT } from "../../jwt/jwt";
import { Database } from "../../infrastructure/persitence/database";
import { UserRepository } from "../../infrastructure/persitence/user/user.repository";

@injectable("Request")
export class LoginService {

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
        
        user.updateRefreshToken(this.generateRefreshToken());
        
        //update refresh token in the database
        this.userRepository.upsertUser(user);
        
        const accessToken = JWT.instance.sign({user: username})
        return {
            token: accessToken,
            refreshToken: user.token!.refreshToken
        }
    }
}