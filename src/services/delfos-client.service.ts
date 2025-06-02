import { Context } from "hono";
import { getCookie } from "hono/cookie";

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
   * Fetches data from the Delfos API using the stored token.
   *
   * @typeParam T - The expected response type.
   * @param path - The API path to fetch (relative to DELFOS_BASE_URL).
   * @param options - Additional fetch options (optional).
   * @param c - Hono context, used to retrieve the token and environment variables.
   * @returns The response data parsed as type T.
   * @throws Error if the Delfos token is missing or the API call fails.
   */
  async fetchFromDelfos<T>(
    path: string,
    options: RequestInit = {},
    c: Context
  ): Promise<T> {
    const token = c.get("delfos_token") || getCookie(c, "delfos_token");
    if (!token) throw new Error("Missing Delfos token");

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");

    const res = await fetch(`${c.env.DELFOS_BASE_URL}/${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }
}
