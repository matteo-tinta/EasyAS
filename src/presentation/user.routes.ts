import { Router } from "express";
import { UserController } from "./controllers/user.controller";
import withAuthVerify from "../middlewares/withAuthVerify";

export const userRoutes = (userController: UserController) => {
    const userRouter = Router();

    userRouter.get("", withAuthVerify, userController.all)

    return userRouter
}