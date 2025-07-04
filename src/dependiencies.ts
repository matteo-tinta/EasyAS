import { Container } from "inversify";
import { LoginController } from "./presentation/controllers/login.controller";
import { DatabaseConnector } from "./infrastructure/persitence/database.connector";
import { Database } from "./infrastructure/persitence/database";
import { TYPES } from "./dependencies.types";
import { UserRepository } from "./infrastructure/persitence/user/user.repository";
import { RegisterController } from "./presentation/controllers/register.controller";
import { UserService } from "./core/services/user.service";
import { JwtService } from "./core/services/jwt.service";
import { ENVIRONMENT } from "./environment";
import { NoRoleService, RoleService } from "./core/services/role.service";

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
container.bind(JwtService).toSelf();
container.bind(UserService).toSelf();

if(ENVIRONMENT.HAS_ROLE){
    console.debug("Roles setup")
    container.bind(TYPES.roleService).to(RoleService)
}
else {
    console.debug("No Roles setup")
    container.bind(TYPES.roleService).to(NoRoleService)
}

//presentation
container.bind(LoginController).toSelf();
container.bind(RegisterController).toSelf();


export {
    container
};