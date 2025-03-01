import { describeRoute } from "npm:hono-openapi@0.4.5";

export const getDbSelectResultsDescription = describeRoute({
  summary: "Retrieves DB Select results",
  description:
    "This endpoint retrieves DB Select results based on search criteria.",
  tags: ["DB Select"],
  parameters: [
    {
      in: "query",
      name: "search",
      schema: { type: "string" },
      description: "The search term.",
    },
    {
      in: "query",
      name: "tableName",
      schema: { type: "string" },
      description: "The name of the table.",
    },
    {
      in: "query",
      name: "columns",
      schema: { type: "string" },
      description: "Comma-separated list of columns to be retrieved.",
    },
    {
      in: "query",
      name: "filter0",
      schema: { type: "string" },
      description:
        "Filter 0 in the format `columnName=value` or `columnName!=value`",
    },
    {
      in: "query",
      name: "filter1",
      schema: { type: "string" },
      description:
        "Filter 1 in the format `columnName=value` or `columnName!=value`",
    },
    {
      in: "query",
      name: "filter2",
      schema: { type: "string" },
      description:
        "Filter 2 in the format `columnName=value` or `columnName!=value`",
    },
    {
      in: "query",
      name: "filter3",
      schema: { type: "string" },
      description:
        "Filter 3 in the format `columnName=value` or `columnName!=value`",
    },
    {
      in: "query",
      name: "filter4",
      schema: { type: "string" },
      description:
        "Filter 4 in the format `columnName=value` or `columnName!=value`",
    },
  ],
  responses: {
    200: {
      description: "The db select results",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
    default: {
      description: "Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
  },
});
