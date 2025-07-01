import { injectable, inject } from "inversify";
import { DatabaseConnector } from "./database.connector";
import { TYPES } from "../../dependencies.types";

@injectable()
export class Database {
    
    constructor(
        @inject(TYPES.databaseConnector)
        private connector: DatabaseConnector) {
        
    }

    public users = this.connector.database.collection("users");
    public tokens = this.connector.database.collection("tokens");
}