import { Request, Response, Router } from "express"
import { inject, injectable } from "inversify";
import { LoginPresentationDto, RenewTokenRequestDto } from "../models/login.model";
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

        const result = await this.userService.loginUserAndGetTokensAsync(body)

        res.status(200).send({ ...result })
    }

    public revokeAllTokensForLoggedInUser = async (req: Request, res: Response) => {
        await this.userService.revokeAllTokens(req.user!.user)

        res.status(200).send({ ok: true })
    }

    public renewToken = async (req: Request<{}, {}, RenewTokenRequestDto>, res: Response) => {
        var body = req.body;

        try {
            var result = await this.userService.renewToken(body.refresh_token)
            res.status(200).send({ ...result })
        } catch (error) {
            console.error(error)
            res.status(400).send({
                "error": "invalid_grant",
                "error_description": "The provided refresh token is invalid or expired"
            });
        }
    }

    public verify = async (req: Request, res: Response) => {
        res.status(200).send({ok: true})
    }
}

