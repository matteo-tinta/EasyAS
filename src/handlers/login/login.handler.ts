import { Request, Response } from "express";
import { DB } from "../../infrastructure/persitence/db";
import { raise } from "../../raise";
import { JWT } from "../../jwt/jwt";

type PAYLOAD = {
    username: string,
    password: string,
}

export default async (req: Request<{}, PAYLOAD, {}>, res: Response) => {
    var body = req.query;

    const result = DB.instance
        .database
        .collection("users")
        .find({ username: body.username, password: body.password })

    if(!result) {
        return res.status(401).send({ error: 401, message: "Credentials invalid" })
    }

    var jwt = JWT.instance.sign({user: body.username})

    return res.status(200).send({
        "token": jwt
    })
}