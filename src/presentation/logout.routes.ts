import { Router } from "express";
import { LogoutController } from "./controllers/logout.controller";

export const logoutRoutes = (controller: LogoutController) => {
    const loginRouter = Router();

    loginRouter.get("/", controller.revokeAllTokensForLoggedInUser)

    return loginRouter
}