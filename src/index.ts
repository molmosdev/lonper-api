import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { supabaseMiddleware } from "./middlewares/supabase.middleware";
import { swaggerConfig } from "./openapi/swagger.config";
import addresses from "./routes/addresses.route";
import auth from "./routes/auth.route";
import dbSelect from "./routes/db-select.route";
import fields from "./routes/fields.route";
import groups from "./routes/groups.route";
import requests from "./routes/requests.route";
import articles from "./routes/articles.route";
import awnings from "./routes/awnings.route";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SWAGGER_USER: string;
  SWAGGER_PASSWORD: string;
  CLIENT_STATIC_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/v3");

// CORS middleware
app.use("*", corsMiddleware);

// Supabase middleware
app.use("*", supabaseMiddleware);

// Routes
app.route("/auth", auth);
app.route("/addresses", addresses);
app.route("/articles", articles);
app.route("/awnings", awnings);
app.route("/db-select", dbSelect);
app.route("/fields", fields);
app.route("/groups", groups);
app.route("/requests", requests);

// Swagger UI configuration
swaggerConfig(app);

export default app;
