import { describeRoute } from "npm:hono-openapi@0.4.5";
import { awningSchema, errorResponseSchema } from "@openapi/schemas.ts";

export const getAwningsDescription = describeRoute({
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

export const getAwningDescription = describeRoute({
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

export const postAwningDescription = describeRoute({
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

export const putAwningDescription = describeRoute({
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

export const deleteAwningDescription = describeRoute({
  summary: "Delete an awning",
  description: "This endpoint deletes an awning.",
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
      description: "Awning deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
            required: ["message"],
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

export const duplicateAwningFieldsDescription = describeRoute({
  summary: "Duplicate awning fields",
  description: "This endpoint duplicates awning fields.",
  tags: ["Awnings"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            duplicateId: {
              type: "string",
              description: "ID of the awning to duplicate",
            },
            newAwningId: {
              type: "string",
              description: "ID of the new awning",
            },
          },
          required: ["duplicateId", "newAwningId"],
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
              message: { type: "string", description: "Success message" },
            },
            required: ["message"],
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

export const getAwningsByFieldIdDescription = describeRoute({
  summary: "Get awnings by field ID",
  description: "This endpoint retrieves awnings by field ID.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "fieldId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Field ID",
    },
  ],
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

export const getAwningPriceDescription = describeRoute({
  summary: "Get awning price",
  description: "This endpoint retrieves the price of an awning.",
  tags: ["Awnings"],
  parameters: [
    {
      name: "model",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Model",
    },
    {
      name: "line",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Line",
    },
    {
      name: "exit",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Exit",
    },
    {
      name: "tarp",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Tarp",
    },
    {
      name: "ral",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "RAL",
    },
    {
      name: "familyCode",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Family code",
    },
  ],
  responses: {
    200: {
      description: "Awning price retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Awning ID" },
              awning: { type: "string", description: "Awning" },
              model: { type: "string", description: "Model" },
              tarp: { type: "string", description: "Tarp" },
              line: { type: "number", description: "Line" },
              exit: { type: "number", description: "Exit" },
              rate: { type: "number", description: "Rate" },
              rateBeforeDiscount: {
                type: "number",
                description: "Rate before discount",
              },
              dto1: { type: "number", description: "Discount 1" },
              dto2: { type: "number", description: "Discount 2" },
              dto3: { type: "number", description: "Discount 3" },
            },
            required: ["id", "awning", "model", "tarp", "line", "exit", "rate"],
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
