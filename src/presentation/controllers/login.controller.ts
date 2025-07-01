import { Request, Response, Router } from "express"
import { inject, injectable } from "inversify";
import { LoginPresentationDto } from "../models/login/login.model";
import { UserService } from "../../core/services/user.service";

@injectable()
export class LoginController {

    constructor(
        @inject(UserService)
        private userService: UserService) {

    }

    public loginAsync = async (req: Request<{}, {}, {}, LoginPresentationDto>, res: Response) => {
        var body = req.query;

        if(!body.username || !body.password) {
            res.status(400).send({})
            return;
        }

        const {
            token, refreshToken
        } = await this.userService.loginUserAndGetTokensAsync(body)

        return res.status(200).send({
            "token": token,
            "refreshToken": refreshToken
        })
    }
}

