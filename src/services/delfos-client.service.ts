import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

/**
 * Represents the request body for the Delfos login endpoint.
 */
export interface LoginRequest {
  usuario: string;
  password: string;
}

/**
 * Represents a successful response from the Delfos login endpoint.
 */
export interface LoginResponseSuccess {
  token: string;
}

/**
 * Represents an error response from the Delfos login endpoint.
 */
export interface LoginResponseError {
  error: string;
}

/**
 * Client for interacting with the Delfos API.
 */
export class DelfosClient {
  /**
   * Logs in to the Delfos API and retrieves a token.
   * @param baseUrl - The base URL of the Delfos API.
   * @param credentials - The login credentials.
   * @returns The login response containing the token.
   * @throws Error if login fails.
   */
  async login(
    baseUrl: string,
    credentials: LoginRequest
  ): Promise<LoginResponseSuccess> {
    const res = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      return (await res.json()) as LoginResponseSuccess;
    } else if (res.status === 401) {
      const body = (await res.json()) as LoginResponseError;
      throw new Error(body.error || "Invalid credentials");
    } else {
      const body = (await res.json()) as LoginResponseError;
      throw new Error(
        `Error ${res.status}: ${res.statusText} - ${await res.text()}`
      );
    }
  }

  /**
   * Fetches data from the Delfos API using the stored token, refreshing it if necessary.
   * @param path - The API path to fetch.
   * @param options - Fetch options.
   * @param c - Hono context.
   * @param retry - Whether to retry once on 401 Unauthorized.
   * @returns The response data.
   * @throws Error if the API call fails.
   */
  async fetchFromDelfos<T>(
    path: string,
    options: RequestInit = {},
    c: Context,
    retry = true
  ): Promise<T> {
    let token = getCookie(c, "delfos_token") || "";

    // If there is no token, try login and retry the request
    if (!token && retry) {
      const loginRes = await this.login(c.env.DELFOS_BASE_URL, {
        usuario: c.env.DELFOS_USER,
        password: c.env.DELFOS_PASSWORD,
      });
      if (!loginRes.token) {
        throw new Error("Failed to obtain Delfos token");
      }
      setCookie(c, "delfos_token", loginRes.token);
      // Retry the request with the new token, but do not login again if it fails
      return this.fetchFromDelfos<T>(path, options, c, false);
    }

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");

    const fetchOptions: RequestInit = {
      ...options,
      headers: headers,
      body: options.body,
    };

    const res = await fetch(`${c.env.DELFOS_BASE_URL}/${path}`, fetchOptions);

    if (res.status === 401 && retry) {
      // Expired or invalid token, try login and retry
      const loginRes = await this.login(c.env.DELFOS_BASE_URL, {
        usuario: c.env.DELFOS_USER,
        password: c.env.DELFOS_PASSWORD,
      });
      if (!loginRes.token) {
        throw new Error("Failed to obtain Delfos token");
      }
      setCookie(c, "delfos_token", loginRes.token);
      return this.fetchFromDelfos<T>(path, options, c, false);
    }

    if (!res.ok) {
      throw new Error("Error calling the Delfos API");
    }

    return res.json() as Promise<T>;
  }
}
