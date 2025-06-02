import { describeRoute } from "hono-openapi";
import {
  loginRequestSchema,
  successMessageSchema,
  errorResponseSchema,
  emailRequestSchema,
  userResponseSchema,
} from "../schemas";

export const loginDesc = describeRoute({
  summary: "Log in a user",
  description: "This endpoint allows a user to log in.",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: loginRequestSchema,
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const logoutDesc = describeRoute({
  summary: "Log out a user",
  description: "This endpoint allows a user to log out.",
  tags: ["Auth"],
  responses: {
    200: {
      description: "User logged out successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const sendPasswordResetEmailDesc = describeRoute({
  summary: "Send a password reset email",
  description: "This endpoint allows sending a password reset email.",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: emailRequestSchema,
      },
    },
  },
  responses: {
    200: {
      description: "Password reset email sent successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const getCurrentUserDesc = describeRoute({
  summary: "Get the current user",
  description: "This endpoint returns the current authenticated user.",
  tags: ["Auth"],
  responses: {
    200: {
      description: "User found",
      content: {
        "application/json": {
          schema: userResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const getClientsDesc = describeRoute({
  summary: "Get all clients",
  description:
    "Returns the raw_user_meta_data of all users from Supabase auth.users table whose role is 'lonper_client'.",
  tags: ["Auth"],
  responses: {
    200: {
      description: "List of clients' metadata",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              clients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    commercialData: {
                      type: "object",
                      properties: {
                        clientNumber: { type: "number" },
                        agentNumber: { type: "number" },
                        commercialDesc: { type: "string" },
                        locality: { type: "string" },
                        commercialDiscount1: { type: "number" },
                        commercialDiscount2: { type: "number" },
                        commercialDiscount3: { type: "number" },
                        authorizedRisk: { type: "number" },
                        currentRisk: { type: "number" },
                        zone: { type: "number" },
                        purchasePotential: { type: "number" },
                        unsubscribed: { type: "boolean" },
                      },
                      required: [
                        "clientNumber",
                        "agentNumber",
                        "commercialDesc",
                        "locality",
                        "commercialDiscount1",
                        "commercialDiscount2",
                        "commercialDiscount3",
                        "authorizedRisk",
                        "currentRisk",
                        "zone",
                        "purchasePotential",
                        "unsubscribed",
                      ],
                    },
                    name: { type: "string" },
                  },
                  required: ["commercialData", "name"],
                },
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
