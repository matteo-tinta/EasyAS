import { Container } from "inversify";
import { LoginController } from "./presentation/controllers/login.controller";
import { LoginService } from "./core/services/login.service";
import { DatabaseConnector } from "./infrastructure/persitence/database.connector";
import { Database } from "./infrastructure/persitence/database";
import { TYPES } from "./dependencies.types";
import { UserRepository } from "./infrastructure/persitence/user/user.repository";
import { RegisterService } from "./core/services/register.service";
import { RegisterController } from "./presentation/controllers/register.controller";

const container = new Container()

//infrastructure
container.bind(TYPES.databaseConnector)
    .toResolvedValue(async () => {
        var connector = new DatabaseConnector()
        return connector.connect()
    })
    .inSingletonScope();

container.bind(Database).toSelf();

container.bind(UserRepository).toSelf();

//core
container.bind(LoginService).toSelf();
container.bind(RegisterService).toSelf();

//presentation
container.bind(LoginController).toSelf();
container.bind(RegisterController).toSelf();

export {
    container
};