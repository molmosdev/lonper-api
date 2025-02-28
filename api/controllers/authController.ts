import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import config from "@config";
import { AuthError } from "@supabase";

class AuthController {
  /**
   * Handles user login.
   * @param c - Hono context object.
   * @returns JSON response with a success message or an error message.
   */
  static async login(c: Context) {
    try {
      const { email, password } = await c.req.json();

      const { data } = await config.database.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (data.session) {
        setCookie(c, "access_token", data.session.access_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60,
          sameSite: "none",
          secure: true,
        });
        return c.json({ message: "Login successful" }, 200);
      } else {
        return c.json({ error: "Incorrect email or password" }, 401);
      }
    } catch (error) {
      console.error(error);
      return c.json({ error: (error as AuthError).message }, 401);
    }
  }

  /**
   * Handles user logout.
   * @param c - Hono context object.
   * @returns JSON response with a success message.
   */
  static logout(c: Context) {
    deleteCookie(c, "access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return c.json({ message: "Logout successful" }, 200);
  }

  /**
   * Sends a password reset email.
   * @param c - Hono context object.
   * @returns JSON response with a success message or an error message.
   */
  static async sendPasswordResetEmail(c: Context) {
    try {
      const { email } = await c.req.json();
      await config.database.auth.resetPasswordForEmail(email);
      return c.json({ message: "Email sent" });
    } catch (error) {
      return c.json({ error: (error as AuthError).message || error });
    }
  }

  /**
   * Retrieves the current user.
   * @param c - Hono context object.
   * @returns JSON response with the current user data.
   */
  static getCurrentUser(c: Context) {
    return c.json(c.get("user"), 200);
  }
}

export default AuthController;
