import { Context } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { openAPISpecs } from "hono-openapi";
import { basicAuth } from "hono/basic-auth";

export const swaggerConfig = (app: any) => {
  const basicAuthMiddleware = (c: Context, next: () => Promise<void>) => {
    const { SWAGGER_USER, SWAGGER_PASSWORD } = c.env;
    const auth = basicAuth({
      username: SWAGGER_USER,
      password: SWAGGER_PASSWORD,
    });
    return auth(c, next);
  };

  app.get("/swagger", swaggerUI({ url: "/v3/openapi" }));

  app.get(
    "/openapi",
    basicAuthMiddleware,
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Portal Lonper API",
          version: "2.0.0",
          description: "Portal Lonper API documentation",
        },
        servers: [
          {
            url: "http://localhost:8787",
            description: "Local server",
          },
          {
            url: "https://lonper.pages.dev",
            description: "Production server",
          },
        ],
      },
    })
  );
};
