import { Container } from "inversify";
import { LoginController } from "./presentation/controllers/login.controller";
import { LoginService } from "./core/services/login.service";
import { DatabaseConnector } from "./infrastructure/persitence/database.connector";
import { Database } from "./infrastructure/persitence/database";
import { TYPES } from "./dependencies.types";

const container = new Container()

//infrastructure
container.bind(TYPES.databaseConnector)
    .toResolvedValue(async () => {
        var connector = new DatabaseConnector()
        return connector.connect()
    })
    .inSingletonScope();

container.bind(Database).toSelf();

//core
container.bind(LoginService).toSelf();

//presentation
container.bind(LoginController).toSelf();

export {
    container
};