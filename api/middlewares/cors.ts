import { cors } from "hono/cors";
import { MiddlewareHandler } from "hono";
import config from "@config";

/**
 * CORS middleware
 * @returns CORS middleware handler
 */
export const corsMiddleware = (): MiddlewareHandler => {
  const allowedOrigins = config.production
    ? ["https://www.portal.lonper.marcolmos.dev"]
    : ["http://localhost:4200"];

  return cors({
    origin: (origin) => {
      if (allowedOrigins.includes(origin) || !origin) {
        return origin;
      }
      return null;
    },
    credentials: true,
  });
};
