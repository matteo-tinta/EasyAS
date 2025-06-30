import express from "express";
import withInit from "./middlewares/withInit";
import globalExceptionHandler from "./middlewares/global-exception-handler";
import bodyParser from "body-parser";

import { DB } from "./infrastructure/persitence/db";
import withLogging from "./middlewares/withLogging";

import registerHandler from "./handlers/register/register.handler"
import loginHandler from "./handlers/login/login.handler";
import withAuthVerify from "./middlewares/withAuthVerify";

const app = express();

app.use(bodyParser.json());

app.use(withInit, withLogging);

// MVP:
// /login <- passa le info di login (username, password). richiama callback con access-token, refresh-token se valido
// /logout <- passato un access-token, invalida tutti i refresh token
// /register <- passa un id utente, username, password e stora su mongo. Restituisce login response
// /refresh <- passato un refresh token, invalida il refresh token passato e ne passa uno nuovo

// configurazioni su file .env (Refresh token expiration time)

// valutare se usare un container di dependency injection (forse no)

app.get("/", async (req, res) => {
  var result = DB.instance.database.collection("test").find().toArray()
  res.send(result)
});

app.post("/register", registerHandler)
app.get("/login", loginHandler)
app.get("/verify", withAuthVerify, (req, res) => res.status(200).send({ ok: true }))

app.use(globalExceptionHandler)

export default app;
