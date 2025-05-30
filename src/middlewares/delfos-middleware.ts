import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { DelfosClient } from "../services/delfos-client.service";

export const delfosMiddleware: MiddlewareHandler = async (c, next) => {
  let token = getCookie(c, "delfos_token");

  if (!token) {
    const client = new DelfosClient();
    const loginRes = await client.login(c.env.DELFOS_BASE_URL, {
      usuario: c.env.DELFOS_USER,
      password: c.env.DELFOS_PASSWORD,
    });
    token = loginRes.token;

    setCookie(c, "delfos_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
    });
  }

  c.set("delfos_token", token);

  await next();
};
