import { describeRoute } from "npm:hono-openapi@0.4.5";
import { errorResponseSchema, requestSchema } from "@openapi/schemas.ts";

export const postRequestDesc = describeRoute({
  summary: "Create a new request",
  description: "This endpoint creates a new request.",
  tags: ["Requests"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: requestSchema,
      },
    },
  },
  responses: {
    201: {
      description: "Request created successfully",
      content: {
        "application/json": {
          schema: requestSchema,
        },
      },
    },
    400: {
      description: "Bad request",
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

export const getRequestsDesc = describeRoute({
  summary: "Get requests",
  description: "This endpoint retrieves requests for the authenticated user.",
  tags: ["Requests"],
  responses: {
    200: {
      description: "Requests retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: requestSchema,
          },
        },
      },
    },
    400: {
      description: "Bad request",
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
