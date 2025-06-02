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
            delfosId: { type: "string", description: "Delfos ID" },
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
            name: { type: "string", description: "Field name" },
            description: { type: "string", description: "Field description" },
            saveOnRequest: { type: "boolean", description: "Save on request" },
            delfosId: { type: "string", description: "Delfos ID" }, // <-- ya está aquí
          },
          required: ["name", "description", "saveOnRequest"],
        },
      },
    },
  },
  responses: {
    200: {
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
  description: "This endpoint deletes a field by its ID.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field to delete",
    },
  ],
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
      description: "Bad request - Invalid field ID",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", description: "Error message" },
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
              error: { type: "string", description: "Error message" },
            },
          },
        },
      },
    },
  },
});

export const putFieldConfigsDesc = describeRoute({
  summary: "Update field subconfigs",
  description:
    "This endpoint updates the subconfigs of a specific field configuration.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field subconfiguration to update",
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Subconfig ID" },
              dataUnit: { type: "string", description: "Data unit" },
              dbSelect: {
                type: "string",
                description: "Database select query",
              },
              hoverText: { type: "string", description: "Hover text" },
              linkedActive: {
                type: "boolean",
                description: "Linked active flag",
              },
              linkedSameDefaultUntouched: {
                type: "boolean",
                description: "Flag for linked same default untouched",
              },
              linkedSameOnValidate: {
                type: "boolean",
                description: "Flag for linked same on validate",
              },
              popup: { type: "boolean", description: "Popup flag" },
              select: { type: "boolean", description: "Select flag" },
              showName: { type: "boolean", description: "Show name flag" },
              required: { type: "boolean", description: "Required flag" },
              size: { type: "string", description: "Size of the field" },
              type: { type: "string", description: "Type of the field" },
              value: { type: "string", description: "Value of the field" },
            },
            required: ["id", "type", "value"],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Field subconfigs updated successfully",
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
      description: "Bad request - Invalid input data",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", description: "Error message" },
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
              error: { type: "string", description: "Error message" },
            },
          },
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
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field configuration to delete",
    },
  ],
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

export const linkFieldConfigToAnAwningDesc = describeRoute({
  summary: "Link a field configuration to an awning",
  description:
    "This endpoint links a field configuration to a specific awning and unlinks the others.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field configuration to link",
    },
    {
      name: "awningId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the awning to link the field configuration to",
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of field configuration IDs to unlink from the awning",
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
      description: "Bad request - Invalid input data",
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

export const unlinkFieldConfigFromAnAwningDesc = describeRoute({
  summary: "Unlink a field configuration from an awning",
  description:
    "This endpoint unlinks a specific field configuration from an awning.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field configuration to unlink",
    },
    {
      name: "awningId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description:
        "The ID of the awning from which the field configuration will be unlinked",
    },
  ],
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
      description: "Bad request - Invalid input data",
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

export const linkFieldConfigToAllAwningsDesc = describeRoute({
  summary: "Link a field configuration to all awnings",
  description:
    "This endpoint links a specific field configuration to all awnings.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field configuration to link to all awnings",
    },
  ],
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
      description: "Bad request - Invalid input data",
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

export const unlinkFieldConfigFromAllAwningsDesc = describeRoute({
  summary: "Unlink a field configuration from all awnings",
  description:
    "This endpoint unlinks a specific field configuration from all awnings.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description:
        "The ID of the field configuration to unlink from all awnings",
    },
  ],
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
      description: "Bad request - Invalid input data",
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

export const getAwningsByFieldIdDesc = describeRoute({
  summary: "Get awnings by field ID",
  description:
    "This endpoint retrieves all awnings associated with a specific field ID.",
  tags: ["Fields"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "The ID of the field to retrieve associated awnings for",
    },
  ],
  responses: {
    200: {
      description: "Awnings retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "Awning ID" },
                awningModelId: {
                  type: "string",
                  description: "Awning Model ID",
                },
                value: { type: "string", description: "Awning value" },
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad request - Invalid field ID",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", description: "Error message" },
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
              error: { type: "string", description: "Error message" },
            },
          },
        },
      },
    },
  },
});
