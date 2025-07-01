import { Request, Response } from "express";
import { DB } from "../../infrastructure/persitence/db";
import { raise } from "../../raise";
import { JWT } from "../../jwt/jwt";
import { randomBytes } from 'crypto';

type PAYLOAD = {
    username: string,
    password: string,
}

const generateRefreshToken = () => randomBytes(32).toString('hex')

export default async (req: Request<{}, {}, {}, PAYLOAD>, res: Response) => {
    var body = req.query;

    if(!body.username || !body.password) {
        res.status(400).send({})
        return;
    }

    const result = await DB.instance
        .database
        .collection("users")
        .find({ username: body.username, password: body.password })
        .toArray()

    if(!result.length) {
        return res.status(401).send({ error: 401, message: "Credentials invalid" })
    }

    var accessToken = JWT.instance.sign({user: body.username})
    var refreshToken = generateRefreshToken();

    //update refresh token in the database
    DB.instance
        .database
        .collection("tokens")
        .insertOne({
            username: body.username,
            refreshToken: refreshToken,
            expireAt: new Date(new Date().getTime() + 60 * 60 * 1000) //expire in 1h
        });

    return res.status(200).send({
        "token": accessToken,
        "refreshToken": refreshToken
    })
}