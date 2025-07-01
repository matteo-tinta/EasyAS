import { injectable, inject } from "inversify";
import { DatabaseConnector } from "./database.connector";
import { TYPES } from "../../dependencies.types";

export type UserCollection = {
    username: string,
    password: string
}

export type TokenCollection = {
    username: string,
    refreshToken: string
}


@injectable()
export class Database {
    
    constructor(
        @inject(TYPES.databaseConnector)
        private connector: DatabaseConnector) {
        
    }

    public users = this.connector.database.collection<UserCollection>("users");
    public tokens = this.connector.database.collection<TokenCollection>("tokens");
}