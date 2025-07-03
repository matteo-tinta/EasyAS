import { inject, injectable } from "inversify";
import { randomBytes } from "crypto";
import { UserRepository } from "../../infrastructure/persitence/user/user.repository";
import { User } from "../../domain/user/user.domain";
import { JwtService } from "./jwt.service";
import { TYPES } from "../../dependencies.types";
import { IRoleService } from "./role.service";

@injectable("Request")
export class UserService {

    constructor(
        @inject(UserRepository) private userRepository: UserRepository,
        @inject(JwtService) private jwtService: JwtService,
        @inject(TYPES.roleService) private roleService: IRoleService,
    ) {
        
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

        const roles = await this.roleService.getRolesForUser(username);
        
        const refreshToken = this.generateRefreshToken()
        user.addToken(refreshToken, new Date(new Date().getTime() + 60 * 60 * 1000));
        
        //update refresh token in the database
        this.userRepository.upsertUser(user);
        
        const accessToken = this.jwtService.sign({user: username, roles})
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

    public renewToken = async (refreshToken: string) => {
        var user = await this.userRepository.getByRefreshTokenAsync(refreshToken)

        if(!user) {
            throw new Error("User does not exist")
        }

        var storedToken = user.tokens.find(f => f.refreshToken == refreshToken);

        if (!storedToken) {
            throw new Error("token does not exist")
        }

        var now = new Date()
        
        user.removeToken(storedToken.refreshToken)
        await this.userRepository.upsertUser(user)

        if (now > storedToken.expiredAt) {    
            throw new Error("invalid grant (expired)")
        }

        return await this.loginUserAndGetTokensAsync({ username: user.username, password: user.password });

    }
}