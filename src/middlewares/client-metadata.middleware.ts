import { User } from "@supabase/supabase-js";
import { Context, MiddlewareHandler, Next } from "hono";
import { Role } from "@lonper/types";
import { createClient } from "@supabase/supabase-js";

export const clientMetadataMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  const user: User = c.get("user");
  let clientMetadata = user.user_metadata;
  const clientNumberFromQuery = c.req.query("clientNumber");

  if (
    user.role === Role.AdvancedWorker &&
    clientNumberFromQuery &&
    !isNaN(Number(clientNumberFromQuery))
  ) {
    const supabaseService = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseService.auth.admin.listUsers();

    if (!error && data?.users) {
      const client = data.users.find(
        (u: any) =>
          u.role === "lonper_client" &&
          u.user_metadata &&
          u.user_metadata.commercialData &&
          u.user_metadata.commercialData.clientNumber ===
            Number(clientNumberFromQuery)
      );
      if (client) {
        clientMetadata = client.user_metadata;
      }
    }
  }

  c.set("clientMetadata", clientMetadata);
  await next();
};
