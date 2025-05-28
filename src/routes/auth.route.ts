import { Context, Hono } from "hono";
import {
  loginDesc,
  logoutDesc,
  sendPasswordResetEmailDesc,
  getCurrentUserDesc,
  getClientsDesc,
} from "../openapi/descriptions/authDescriptions";
import { userMiddleware } from "../middlewares/user.middleware";
import { AuthError } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

const app = new Hono();

app.post("/login", loginDesc, async (c: Context) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ message: "Email and password are required" }, 400);
  }

  const supabase = c.get("supabase");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error during email/password login:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }

  return c.json({ message: "Login successful" }, 200);
});

app.post("/logout", logoutDesc, userMiddleware, async (c: Context) => {
  const supabase = c.get("supabase");

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error during logout:", error);
    return c.json({ error: "Logout failed" }, 500);
  }

  c.set("user", null);
  return c.json({ message: "Logout successful" }, 200);
});

app.post(
  "/send-password-reset-email",
  sendPasswordResetEmailDesc,
  userMiddleware,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { email } = await c.req.json();
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Password reset error:", error.message);
        return c.json({ error: "Error sending password reset email" }, 400);
      }

      return c.json({ message: "Password reset email sent" }, 200);
    } catch (error) {
      console.error("Password reset error:", error);
      return c.json(
        {
          error:
            (error as AuthError).message || "Error processing password reset",
        },
        500
      );
    }
  }
);

app.get("/user", getCurrentUserDesc, userMiddleware, (c: Context) => {
  return c.json(c.get("user"), 200);
});

app.get("/clients", getClientsDesc, async (c: Context) => {
  const supabaseService = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch all users from Supabase auth.users
  const { data, error } = await supabaseService.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching clients:", error);
    return c.json({ error: "Error fetching clients" }, 500);
  }

  // Filter users where role === 'lonper_client' and return only user_metadata
  const clients = data.users
    .filter((user: any) => user.role === "lonper_client")
    .map((user: any) => user.user_metadata);

  console.log(clients);

  return c.json(clients, 200);
});

export default app;
