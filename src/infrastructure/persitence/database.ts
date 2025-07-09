import { inject, injectable } from "inversify";
import { TYPES } from "../../dependencies.types";
import { DatabaseConnector } from "./database.connector";

export type UserCollection = {
    username: string,
    password: string
}

export type TokenCollection = {
    username: string,
    refreshToken: string,
    expiredAt: Date,
}


@injectable()
export class Database {

    constructor(
        @inject(TYPES.databaseConnector)
        private connector: DatabaseConnector) {

    }

    public get users() {
        return this.connector.database.collection<UserCollection>("users");
    }

    public get tokens() {
        return this.connector.database.collection<TokenCollection>("tokens");
    }
}