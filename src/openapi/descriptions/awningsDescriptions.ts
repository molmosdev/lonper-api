import { describeRoute } from "hono-openapi";
import { awningSchema, errorResponseSchema } from "../schemas";

export const getAwningsDesc = describeRoute({
  summary: "Get all awnings",
  description: "This endpoint retrieves all awnings.",
  tags: ["Awnings"],
  responses: {
    200: {
      description: "Awnings retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: awningSchema,
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

export const getAwningDesc = describeRoute({
  summary: "Get a specific awning by ID",
  description: "This endpoint retrieves a specific awning by its ID.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Awning ID",
    },
  ],
  responses: {
    200: {
      description: "Awning retrieved successfully",
      content: {
        "application/json": {
          schema: awningSchema,
        },
      },
    },
    404: {
      description: "Awning not found",
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

export const postAwningDesc = describeRoute({
  summary: "Create a new awning",
  description: "This endpoint creates a new awning.",
  tags: ["Awnings"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Awning ID" },
            value: { type: "string", description: "Awning value" },
            awningModelId: {
              type: "string",
              description: "Awning Model ID",
              nullable: true,
            },
          },
          required: ["id", "value"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Awning created successfully",
      content: {
        "application/json": {
          schema: awningSchema,
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

export const putAwningDesc = describeRoute({
  summary: "Update an existing awning",
  description: "This endpoint updates an existing awning.",
  tags: ["Awnings"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Awning ID" },
            value: { type: "string", description: "Awning value" },
            awningModelId: {
              type: "string",
              description: "Awning Model ID",
              nullable: true,
            },
          },
          required: ["id", "value"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Awning updated successfully",
      content: {
        "application/json": {
          schema: awningSchema,
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

export const deleteAwningDesc = describeRoute({
  summary: "Delete an awning",
  description: "This endpoint deletes an awning by its ID.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "The ID of the awning to delete",
      schema: {
        type: "string",
        example: "12345",
      },
    },
  ],
  responses: {
    200: {
      description: "Awning deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Awning deleted successfully.",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Awning not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Awning not found." },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Internal server error." },
            },
          },
        },
      },
    },
  },
});

export const duplicateAwningFieldsDesc = describeRoute({
  summary: "Duplicate awning fields",
  description: "This endpoint duplicates the fields of an awning.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "ID of the awning to duplicate",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            newId: {
              type: "string",
              description: "ID of the new awning",
            },
          },
          required: ["newId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Fields duplicated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Fields duplicated successfully.",
              },
            },
          },
        },
      },
    },
    404: {
      description: "No fields found for the specified awning ID",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "No fields found for the specified awning ID.",
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
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Internal server error." },
            },
          },
        },
      },
    },
  },
});

export const getAwningPriceDesc = describeRoute({
  summary: "Retrieve the price of an awning",
  description:
    "This endpoint calculates and retrieves the price of an awning based on the provided parameters.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "model",
      in: "query",
      required: true,
      schema: { type: "string" },
      description: "The model of the awning.",
    },
    {
      name: "line",
      in: "query",
      required: true,
      schema: { type: "integer" },
      description: "The line of the awning.",
    },
    {
      name: "exit",
      in: "query",
      required: true,
      schema: { type: "integer" },
      description: "The exit of the awning.",
    },
    {
      name: "tarp",
      in: "query",
      required: true,
      schema: { type: "string" },
      description: "The tarp of the awning.",
    },
    {
      name: "ral",
      in: "query",
      required: true,
      schema: { type: "string" },
      description: "The RAL color of the awning.",
    },
    {
      name: "familyCode",
      in: "query",
      required: true,
      schema: { type: "string" },
      description: "The family code of the awning.",
    },
  ],
  responses: {
    200: {
      description: "Awning price retrieved successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "The ID of the awning." },
              awning: { type: "string", description: "The awning name." },
              model: {
                type: "string",
                description: "The model of the awning.",
              },
              tarp: { type: "string", description: "The tarp of the awning." },
              line: { type: "integer", description: "The line of the awning." },
              exit: { type: "integer", description: "The exit of the awning." },
              rate: {
                type: "number",
                description: "The final price of the awning.",
              },
              rateBeforeDiscount: {
                type: "number",
                description:
                  "The price of the awning before applying discounts.",
              },
              dto1: {
                type: "number",
                description: "The first discount applied.",
              },
              dto2: {
                type: "number",
                description: "The second discount applied.",
              },
              dto3: {
                type: "number",
                description: "The third discount applied.",
              },
            },
            required: ["id", "awning", "model", "tarp", "line", "exit", "rate"],
          },
        },
      },
    },
    400: {
      description: "Invalid parameters provided.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Invalid line or exit parameter.",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Internal server error while getting awning price.",
              },
            },
          },
        },
      },
    },
  },
});
