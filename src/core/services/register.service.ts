import { inject, injectable } from "inversify";
import { randomBytes } from "crypto";
import { JWT } from "../../jwt/jwt";
import { Database } from "../../infrastructure/persitence/database";
import { UserRepository } from "../../infrastructure/persitence/user/user.repository";
import { User } from "../../domain/user/user.domain";

@injectable("Request")
export class RegisterService {

    constructor(@inject(UserRepository) private userRepository: UserRepository) {
        
    }

    public registerUserAsync = async (options: {
        username: string,
        password: string,
    }) => {
        const {
            username,
            password
        } = options

        const user = await this.userRepository.upsertUser(new User(username, password, null))

        if(!user) {
            throw new Error("Unable to create a new user")
        }
        
        return true;
    }
}