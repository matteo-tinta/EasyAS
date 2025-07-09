import * as mongoDB from "mongodb";
import { ENVIRONMENT } from "../../environment";

export class DatabaseConnector {
    public database!: mongoDB.Db;
    public client: mongoDB.MongoClient;

    public constructor() {
        this.client = new mongoDB.MongoClient(ENVIRONMENT.DB_CONN_STRING());
    }

    async connect() {
        await this.client.connect();
        this.database = this.client.db();
        return this;
    }
}
