import express from "express";
import withInit from "./middlewares/withInit";
import globalExceptionHandler from "./middlewares/global-exception-handler";
import bodyParser from "body-parser";

import withLogging from "./middlewares/withLogging";

import withAuthVerify from "./middlewares/withAuthVerify";
import refreshHandler from "./handlers/refresh/refresh.handler";
import { LoginController } from "./presentation/controllers/login.controller";
import { loginRoutes } from "./presentation/login.routes";
import { container } from "./dependiencies";
import { registerRoutes } from "./presentation/register.routes";
import { RegisterController } from "./presentation/controllers/register.controller";
import { logoutRoutes } from "./presentation/logout.routes";
import { LogoutController } from "./presentation/controllers/logout.controller";

const startAppAsync = async () => {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(withInit, withLogging);

    app.use("/login", loginRoutes(await container.getAsync(LoginController)))
    app.use("/register", registerRoutes(await container.getAsync(RegisterController)))
    app.use("/logout", withAuthVerify, logoutRoutes(await container.getAsync(LogoutController)))

    app.get("/verify", withAuthVerify, (req, res) => res.status(200).send({ ok: true }))
    app.post("/token", refreshHandler)

    app.use(globalExceptionHandler)

    return app;
}

export default startAppAsync;