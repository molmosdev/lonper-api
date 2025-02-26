import { createClient } from "jsr:@supabase/supabase-js@2";

export default {
  production: false,
  swagger: {
    user: Deno.env.get("SWAGGER_USER"),
    password: Deno.env.get("SWAGGER_PASSWORD"),
  },
  supabase: createClient(
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    Deno.env.get("SUPABASE_KEY")!
  ),
};
