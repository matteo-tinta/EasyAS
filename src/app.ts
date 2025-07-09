import express from "express";
import globalExceptionHandler from "./middlewares/global-exception-handler";
import bodyParser from "body-parser";

import withLogging from "./middlewares/withLogging";

import { LoginController } from "./presentation/controllers/login.controller";
import { loginRoutes } from "./presentation/login.routes";
import { container } from "./dependiencies";
import { registerRoutes } from "./presentation/register.routes";
import { RegisterController } from "./presentation/controllers/register.controller";
import { userRoutes } from "./presentation/user.routes";
import { UserController } from "./presentation/controllers/user.controller";

const startAppAsync = async () => {
    const app = express();

    //app global configurations
    app.use(
        express.urlencoded({ extended: true }),
        bodyParser.json(),
        withLogging
    )

    app.use("/users", userRoutes(await container.getAsync(UserController)))
    app.use("/token", loginRoutes(await container.getAsync(LoginController)))
    app.use("/register", registerRoutes(await container.getAsync(RegisterController)))

    app.use(globalExceptionHandler)

    return app;
}

export default startAppAsync;