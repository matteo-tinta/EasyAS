import { Request, Response } from "express";
import { DB } from "../../infrastructure/persitence/db";
import { raise } from "../../raise";

type PAYLOAD = {
    username: string,
    password: string,
}

export default async (req: Request<{}, {}, PAYLOAD>, res: Response) => {
    var body = req.body;

    const result = await DB.instance
        .database
        .collection("users")
        .insertOne(body)

    if(!result) {
        raise("Unable to add a new user to database")
    }

    return res.send({
        insertedId: result.insertedId
    })
}