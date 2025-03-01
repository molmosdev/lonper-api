import { Hono } from "hono";
import addressesRouter from "@routers/addressesRouter.ts";
import authRouter from "@routers/authRouter.ts";
import articlesRouter from "@routers/articlesRouter.ts";
import awningsRouter from "@routers/awningsRouter.ts";
import dbSelectRouter from "@routers/dbSelectRouter.ts";
import fieldsRouter from "@routers/fieldsRouter.ts";
import groupsRouter from "@routers/groupsRouter.ts";

const rootRouter = new Hono();

rootRouter.route("/auth", authRouter);

rootRouter.route("/addresses", addressesRouter);

rootRouter.route("/articles", articlesRouter);

rootRouter.route("/awnings", awningsRouter);

rootRouter.route("/dbSelect", dbSelectRouter);

rootRouter.route("/fields", fieldsRouter);

rootRouter.route("/groups", groupsRouter);

export default rootRouter;
