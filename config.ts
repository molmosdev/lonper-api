import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Get environment variable
 * @param key - The key of the environment variable
 * @returns The value of the environment variable
 */
function getEnvVariable(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export default {
  production: false,
  swagger: {
    user: getEnvVariable("SWAGGER_USER"),
    password: getEnvVariable("SWAGGER_PASSWORD"),
  },
  database: createClient(
    getEnvVariable("SUPABASE_SERVICE_ROLE_KEY"),
    getEnvVariable("SUPABASE_KEY")
  ),
};
