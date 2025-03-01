import { Hono } from "hono";
import config from "@config";
import { cors } from "hono/cors";
import { openAPISpecs } from "npm:hono-openapi@0.4.5";
import { swaggerUI } from "@hono/swagger-ui";
import { basicAuth } from "hono/basic-auth";
import rootRouter from "@routers/index.ts";

const app = new Hono();

// CORS configuration
const allowedOrigins = config.production
  ? ["https://www.portal.lonper.molmos.dev"]
  : ["http://localhost:4200"];

app.use(
  "/api/*",
  cors({
    origin: (origin) => {
      if (allowedOrigins.includes(origin) || !origin) {
        return origin;
      }
      return null;
    },
    credentials: true,
  }),
);

// Swagger configuration
app.get("/docs", swaggerUI({ url: "/openapi" }));

app.get(
  "/openapi",
  basicAuth({
    username: config.swagger.user!,
    password: config.swagger.password!,
  }),
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Portal Lonper API",
        version: "2.0.0",
        description: "Portal Lonper API documentation",
      },
      servers: [
        {
          url: "http://localhost:8000",
          description: "Local server",
        },
        {
          url: "https://api.lonper.molmos.dev",
          description: "Production server",
        },
      ],
    },
  }),
);

// Routers
app.route("/api/v2", rootRouter);

Deno.serve(app.fetch);
