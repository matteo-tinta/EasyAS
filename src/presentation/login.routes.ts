import { Router } from "express";
import { LoginController } from "./controllers/login.controller";
import withAuthVerify from "../middlewares/withAuthVerify";

export const loginRoutes = (loginController: LoginController) => {
    const loginRouter = Router();

    loginRouter.get("/login", loginController.loginAsync)
    loginRouter.post("/renew", loginController.renewToken)

    loginRouter.get("/logout", withAuthVerify, loginController.revokeAllTokensForLoggedInUser)
    loginRouter.get("/verify", withAuthVerify, loginController.verify)

    return loginRouter
}