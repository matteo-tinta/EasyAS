import { Request, Response, Router } from "express"
import { inject, injectable } from "inversify";
import { UserService } from "../../core/services/user.service";

@injectable()
export class LogoutController {

    constructor(
        @inject(UserService)
        private userService: UserService) {

    }

    public revokeAllTokensForLoggedInUser = async (req: Request, res: Response) => {
        await this.userService.revokeAllTokens(req.user!.user)

        res.status(200).send({ ok: true })
    }
}

