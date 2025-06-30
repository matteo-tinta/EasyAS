import * as mongoDB from "mongodb";
import { ENVIRONMENT } from "../../environment";

export class DB {
    static #instance: DB;
    public client: mongoDB.MongoClient;
    public database!: mongoDB.Db;
    private connected: boolean = false;
    
    
    private constructor() {
        this.client = new mongoDB.MongoClient(ENVIRONMENT.DB_CONN_STRING);
    }

    public async connect() {
        if(!this.connected) {
            await this.client.connect();
        }
        
        this.connected = true;
        this.database = this.client.db(ENVIRONMENT.DB_NAME);

        return this;
    }

    public async disconnect() {
        if(this.connected) {
            await this.client.close();
        }
    }

    public static get instance() {
        if(!this.#instance) {
            this.#instance = new DB();
        }

        return this.#instance
    }
}