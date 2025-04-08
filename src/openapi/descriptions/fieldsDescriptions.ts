import { describeRoute } from "hono-openapi";
import {
  fieldSchema,
  errorResponseSchema,
  fieldSubconfigSchema,
} from "../schemas";

export const postFieldDesc = describeRoute({
  summary: "Create a new field",
  description: "This endpoint creates a new field.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Field name" },
            description: { type: "string", description: "Field description" },
            saveOnRequest: { type: "boolean", description: "Save on request" },
            groupId: { type: "string", description: "Group ID" },
          },
          required: ["name", "description", "saveOnRequest", "groupId"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Field created successfully",
      content: {
        "application/json": {
          schema: fieldSchema,
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

export const putFieldDesc = describeRoute({
  summary: "Update a field",
  description: "This endpoint updates a field.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Field ID" },
            name: { type: "string", description: "Field name" },
            description: { type: "string", description: "Field description" },
            saveOnRequest: { type: "boolean", description: "Save on request" },
          },
          required: ["id", "name", "description", "saveOnRequest"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Field updated successfully",
      content: {
        "application/json": {
          schema: fieldSchema,
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

export const putFieldsOrderDesc = describeRoute({
  summary: "Update fields order",
  description: "This endpoint updates the order of fields.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            previousIndex: { type: "number", description: "Previous index" },
            currentIndex: { type: "number", description: "Current index" },
            groupId: { type: "string", description: "Group ID" },
          },
          required: ["previousIndex", "currentIndex", "groupId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Fields order updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const deleteFieldDesc = describeRoute({
  summary: "Delete a field",
  description: "This endpoint deletes a field.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Field ID" },
          },
          required: ["id"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const putFieldConfigsDesc = describeRoute({
  summary: "Update field configurations",
  description: "This endpoint updates field configurations.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Field ID" },
            configs: {
              type: "array",
              items: fieldSubconfigSchema,
            },
          },
          required: ["id", "configs"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configurations updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const createConfigDesc = describeRoute({
  summary: "Create a new field configuration",
  description: "This endpoint creates a new field configuration.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Field ID" },
          },
          required: ["id"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Field configuration created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Field Config ID" },
              fieldId: { type: "string", description: "Field ID" },
            },
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

export const deleteConfigDesc = describeRoute({
  summary: "Delete a field configuration",
  description: "This endpoint deletes a field configuration.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Field Config ID" },
          },
          required: ["id"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configuration deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const getFieldsConfigsIdsActiveForAnAwningDesc = describeRoute({
  summary: "Get active field configurations for an awning",
  description:
    "This endpoint retrieves active field configurations for an awning.",
  tags: ["Fields"],
  parameters: [
    {
      name: "awningId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Awning ID",
    },
  ],
  responses: {
    200: {
      description: "Active field configurations retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: { type: "string" },
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

export const linkFieldConfigToAnAwningDesc = describeRoute({
  summary: "Link a field configuration to an awning",
  description: "This endpoint links a field configuration to an awning.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fieldsIdsToUnlink: {
              type: "array",
              items: { type: "string" },
              description: "Array of field IDs to unlink",
            },
            fieldIdToLink: { type: "string", description: "Field ID to link" },
            awningId: { type: "string", description: "Awning ID" },
          },
          required: ["fieldsIdsToUnlink", "fieldIdToLink", "awningId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configuration linked to awning successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const unlinkFieldConfigToAnAwningDesc = describeRoute({
  summary: "Unlink a field configuration from an awning",
  description: "This endpoint unlinks a field configuration from an awning.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fieldIdToUnlink: {
              type: "string",
              description: "Field ID to unlink",
            },
            awningId: { type: "string", description: "Awning ID" },
          },
          required: ["fieldIdToUnlink", "awningId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configuration unlinked from awning successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const linkFieldConfigForAllAwningsDesc = describeRoute({
  summary: "Link a field configuration to all awnings",
  description: "This endpoint links a field configuration to all awnings.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fieldConfigId: { type: "string", description: "Field Config ID" },
          },
          required: ["fieldConfigId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configuration linked to all awnings successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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

export const unlinkFieldConfigForAllAwningsDesc = describeRoute({
  summary: "Unlink a field configuration from all awnings",
  description: "This endpoint unlinks a field configuration from all awnings.",
  tags: ["Fields"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fieldConfigId: { type: "string", description: "Field Config ID" },
          },
          required: ["fieldConfigId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field configuration unlinked from all awnings successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
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
