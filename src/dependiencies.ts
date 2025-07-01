import { Container } from "inversify";
import { LoginController } from "./presentation/controllers/login.controller";
import { DatabaseConnector } from "./infrastructure/persitence/database.connector";
import { Database } from "./infrastructure/persitence/database";
import { TYPES } from "./dependencies.types";
import { UserRepository } from "./infrastructure/persitence/user/user.repository";
import { RegisterController } from "./presentation/controllers/register.controller";
import { UserService } from "./core/services/user.service";
import { LogoutController } from "./presentation/controllers/logout.controller";

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
container.bind(UserService).toSelf();

//presentation
container.bind(LoginController).toSelf();
container.bind(RegisterController).toSelf();
container.bind(LogoutController).toSelf();

export {
    container
};