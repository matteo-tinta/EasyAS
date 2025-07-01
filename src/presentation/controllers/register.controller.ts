import { Request, Response, Router } from "express"
import { inject, injectable } from "inversify";
import { RegisterService } from "../../core/services/register.service";

@injectable()
export class RegisterController {

    constructor(
        @inject(RegisterService)
        private registerService: RegisterService) {

    }

    public registerAsync = async (req: Request<{}, {}, RegisterRequestDto>, res: Response) => {
        var body = req.body;

        if(!body.username || !body.password) {
            res.status(400).send({})
            return;
        }

        var result = await this.registerService.registerUserAsync({
            ...body
        })

        res.status(200).send({
            ok: result
        })
    }
}

