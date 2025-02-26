import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const env = config();

export default {
  production: false,
  swagger: {
    user: env.SWAGGER_USER,
    password: env.SWAGGER_PASSWORD,
  },
  supabase: createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY),
};
