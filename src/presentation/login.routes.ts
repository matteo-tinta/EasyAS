import { Router } from "express";
import { LoginController } from "./controllers/login.controller";

export const loginRoutes = (loginController: LoginController) => {
    const loginRouter = Router();

    loginRouter.get("/", loginController.loginAsync)

    return loginRouter
}