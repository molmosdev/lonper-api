import { describeRoute } from "hono-openapi";
import { errorResponseSchema, requestSchema, messageResponseSchema } from "../schemas";

export const postRequestDesc = describeRoute({
  summary: "Create or update a request (budget or order)",
  description:
    "This endpoint creates a new request (budget or order).\n" +
    "If a request with the same ID and type 'budget' exists and the new type is 'order', it will update the existing budget to an order.\n" +
    "If the type is 'order', the request will also be sent to Delfos as an order.\n" +
    "\n" +
    "The response contains only a message string (no created/updated data or success flag is returned).",
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
      description: "Request created or updated successfully",
      content: {
        "application/json": {
          schema: messageResponseSchema,
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
