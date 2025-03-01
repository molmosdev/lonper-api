import { Hono } from "hono";
import { corsMiddleware } from "@middlewares/cors.ts";
import { setupSwagger } from "@middlewares/swagger.ts";
import rootRouter from "@routers/index.ts";

const app = new Hono();

// CORS configuration
app.use("/api/*", corsMiddleware());

// Swagger configuration
setupSwagger(app);

// Routers
app.route("/api/v2", rootRouter);

Deno.serve(app.fetch);
