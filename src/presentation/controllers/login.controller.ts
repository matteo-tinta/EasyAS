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

        try {
            const result = await this.userService.loginUserAndGetTokensAsync(body)
            return res.status(200).send({ ...result })
        } catch (error) {
            console.error(error)
            return res.status(401).send({ error: "Credentials Invalid" })
        }

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

    public decode = (req: Request, res: Response) => {
        const decodedTokenAsExample = {
            userId: req.headers["x_roles_user_id"]
        }

        if(!decodedTokenAsExample.userId) {
            console.dir({
                error: "x_roles_user_id missing", 
                headers: req.headers
            })

            return res.status(401).json({
                error: "x_roles_user_id missing", 
                headers: req.headers
            })
        }

        return res.status(200).json(decodedTokenAsExample)
    };
}

