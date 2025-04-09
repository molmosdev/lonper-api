import { describeRoute } from "hono-openapi";
import { articleSchema, errorResponseSchema } from "../schemas";

export const getArticlesByIdsDesc = describeRoute({
  summary: "Get articles by IDs",
  description: "This endpoint retrieves articles by their IDs.",
  tags: ["Articles"],
  parameters: [
    {
      name: "ids",
      in: "query",
      required: true,
      description: "Comma-separated list of article IDs",
      schema: {
        type: "string",
        example: "1,2,3",
      },
    },
  ],
  responses: {
    200: {
      description: "Articles retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: articleSchema,
          },
        },
      },
    },
    400: {
      description: "Bad request - Missing or invalid article IDs",
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
