import { Request, Response, Router } from "express"
import { inject, injectable } from "inversify";
import { UserService } from "../../core/services/user.service";

@injectable()
export class RegisterController {

    constructor(
        @inject(UserService)
        private userService: UserService) {

    }

    public registerAsync = async (req: Request<{}, {}, RegisterRequestDto>, res: Response) => {
        var body = req.body;

        if(!body.username || !body.password) {
            res.status(400).send({})
            return;
        }

        var result = await this.userService.registerUserAsync({
            ...body
        })

        res.status(200).send({
            ok: result
        })
    }
}

