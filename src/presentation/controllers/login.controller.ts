import { Request, Response, Router } from "express"
import { LoginService } from "../../core/services/login.service";
import { inject, injectable } from "inversify";
import { LoginPresentationDto } from "../models/login/login.model";

@injectable()
export class LoginController {

    constructor(
        @inject(LoginService)
        private loginService: LoginService) {

    }

    public loginAsync = async (req: Request<{}, {}, {}, LoginPresentationDto>, res: Response) => {
        var body = req.query;

        if(!body.username || !body.password) {
            res.status(400).send({})
            return;
        }

        const {
            token, refreshToken
        } = await this.loginService.loginUserAndGetTokensAsync(body)

        return res.status(200).send({
            "token": token,
            "refreshToken": refreshToken
        })
    }
}

