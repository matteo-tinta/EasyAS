import { Router } from "express";
import { RegisterController } from "./controllers/register.controller";

export const registerRoutes = (controller: RegisterController) => {
    const router = Router();

    router.post("/", controller.registerAsync)

    return router
}