import { Hono } from "hono";
import { corsMiddleware } from "@middlewares/cors.ts";
import { setupSwagger } from "@middlewares/swagger.ts";
import rootRouter from "@routers/index.ts";
import { getWelcomePage } from "@utils/welcomePage.ts";

const app = new Hono();

// CORS configuration
app.use("/api/*", corsMiddleware());

// Swagger configuration
setupSwagger(app);

// Welcome route
app.get("/", (c) => {
  return c.html(getWelcomePage());
});

// Routers
app.route("/api/v2", rootRouter);

Deno.serve(app.fetch);
