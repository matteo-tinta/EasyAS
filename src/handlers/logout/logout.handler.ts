import { Request, Response } from "express";
import { DB } from "../../infrastructure/persitence/db";
import { RefreshTokenModel } from "../../infrastructure/persitence/models/refresh-token.model";

export default async (req: Request, res: Response) => {
    await DB.instance
        .database
        .collection<RefreshTokenModel>("tokens")
        .deleteMany({ username: req.user?.user })

    res.status(200).send({})
}