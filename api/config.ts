import { createClient } from "@supabase";

export default {
  production: true,
  swagger: {
    user: Deno.env.get("SWAGGER_USER"),
    password: Deno.env.get("SWAGGER_PASSWORD"),
  },
  database: createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  ),
};
