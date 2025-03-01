// middleware/swagger.ts
import { swaggerUI } from "@hono/swagger-ui";
import { openAPISpecs } from "npm:hono-openapi@0.4.5";
import { basicAuth } from "hono/basic-auth";
import { Hono } from "hono";
import config from "@config";

export const setupSwagger = (app: Hono) => {
  // Configuración de Swagger UI
  app.get("/docs", swaggerUI({ url: "/openapi" }));

  // Configuración de OpenAPI Specs
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
};
