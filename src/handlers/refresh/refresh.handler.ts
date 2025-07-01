import { Request, Response } from "express";
import { DB } from "../../infrastructure/persitence/db";
import { raise } from "../../raise";
import { JWT } from "../../jwt/jwt";
import { randomBytes } from 'crypto';
import { RefreshTokenModel } from "../../infrastructure/persitence/models/refresh-token.model";

type PAYLOAD = {
    grant_type: string;
    refresh_token: string;
}

const generateRefreshToken = () => randomBytes(32).toString('hex')

export default async (req: Request<{}, {}, PAYLOAD>, res: Response) => {
    var body = req.body;

    //update refresh token in the database
    var token = await DB.instance
        .database
        .collection<RefreshTokenModel>("tokens")
        .findOne({
            refreshToken: body.refresh_token,
        });

    if (!token) {
        res.status(400).send({
            "error": "invalid_grant",
            "error_description": "The provided refresh token is invalid or expired"
        })
        return;
    }

    var now = new Date()
    if (now > token.expireAt) {
        await DB.instance
            .database
            .collection<RefreshTokenModel>("tokens")
            .deleteOne({
                refreshToken: body.refresh_token,
            });

        res.status(400).send({
            "error": "invalid_grant",
            "error_description": "The provided refresh token is invalid or expired"
        })
        return;
    }

    var refreshToken = generateRefreshToken();
    var result = await DB.instance
        .database
        .collection("tokens")
        .findOneAndUpdate(
            {
                refreshToken: token.refreshToken,
            },
            {
                $set: {
                    refreshToken: refreshToken,
                    expireAt: new Date(new Date().getTime() + 60 * 60 * 1000) //expire in 1h
                }
            });

    if(!result) {
        console.error("unable to store the new refresh token");
        res.status(400).send({
            "error": "invalid_grant",
            "error_description": "The provided refresh token is invalid or expired"
        });
        return;
    }

    var accessToken = JWT.instance.sign({ user: token.username })

    return res.status(200).send({
        "token": accessToken,
        "refreshToken": refreshToken
    })
}