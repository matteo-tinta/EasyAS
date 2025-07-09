import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UserService } from "../../core/services/user.service";
import { LoginPresentationDto } from "../models/login.model";

@injectable()
export class UserController {

    constructor(
        @inject(UserService)
        private userService: UserService) {

    }

    public all = async (req: Request<{}, {}, {}, LoginPresentationDto>, res: Response) => {
        const users = await this.userService.getAllUsers()
        return res.status(200).json(users.map(u => ({
            ...u,
            password: undefined
        })))
    }
}

