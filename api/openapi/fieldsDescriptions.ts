import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
const fieldSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Field ID" },
    name: { type: "string", description: "Field name" },
    description: { type: "string", description: "Field description" },
    order: { type: "number", description: "Field order" },
    groupId: { type: "string", description: "Group ID" },
    saveOnRequest: { type: "boolean", description: "Save on request" },
  },
  required: ["id", "name", "description", "order", "groupId", "saveOnRequest"],
};

const errorResponseSchema = {
  type: "object",
  properties: {
    code: { type: "integer", format: "int32", description: "HTTP error code" },
    message: { type: "string", description: "Detailed error message" },
  },
  required: ["code", "message"],
};

const columnSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Column name" },
  },
  required: ["name"],
};

const dbSelectFilterSchema = {
  type: "object",
  properties: {
    columnName: { type: "string", description: "Column name" },
    equal: { type: "boolean", description: "Equal" },
    value: { type: "string", description: "Value", nullable: true },
    targetFieldId: {
      type: "string",
      description: "Target field ID",
      nullable: true,
    },
    linked: { type: "boolean", description: "Linked" },
  },
  required: ["columnName", "equal", "linked"],
};

const dbSelectSchema = {
  type: "object",
  properties: {
    columnsToSave: {
      type: "array",
      items: columnSchema,
      description: "Columns to save",
    },
    columnsToShow: {
      type: "array",
      items: columnSchema,
      description: "Columns to show",
    },
    columnsToSearch: {
      type: "array",
      items: columnSchema,
      description: "Columns to search",
    },
    filters: {
      type: "array",
      items: dbSelectFilterSchema,
      description: "Filters",
    },
    labelText: { type: "string", description: "Label text" },
    noContentText: { type: "string", description: "No content text" },
    searchable: { type: "boolean", description: "Searchable" },
    tableName: { type: "string", description: "Table name" },
  },
  required: [
    "columnsToSave",
    "columnsToShow",
    "columnsToSearch",
    "filters",
    "labelText",
    "noContentText",
    "searchable",
    "tableName",
  ],
};

const linkedActiveSchema = {
  type: "object",
  properties: {
    targetFieldId: {
      type: "string",
      description: "Target field ID",
      nullable: true,
    },
    value: { type: "string", description: "Value", nullable: true },
  },
  required: ["targetFieldId", "value"],
};

const popupSchema = {
  type: "object",
  properties: {
    activated: { type: "boolean", description: "Activated" },
    title: { type: "string", description: "Title" },
    text: { type: "string", description: "Text" },
    imgUrl: { type: "string", description: "Image URL" },
  },
  required: ["activated", "title", "text", "imgUrl"],
};

const selectOptionSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Option name" },
    default: { type: "boolean", description: "Default option" },
  },
  required: ["name", "default"],
};

const fieldSubconfigSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Subconfig ID" },
    fieldConfigId: { type: "string", description: "Field Config ID" },
    showName: { type: "boolean", description: "Show name" },
    type: { type: "string", description: "Type" },
    value: { type: "any", description: "Value", nullable: true },
    dataUnit: { type: "string", description: "Data unit", nullable: true },
    size: { type: "string", description: "Size" },
    hoverText: { type: "string", description: "Hover text" },
    dbSelect: {
      type: "object",
      description: "DB select",
      nullable: true,
      properties: dbSelectSchema.properties,
    },
    select: {
      type: "array",
      items: selectOptionSchema,
      description: "Select options",
      nullable: true,
    },
    linkedActive: {
      type: "array",
      items: linkedActiveSchema,
      description: "Linked active",
      nullable: true,
    },
    linkedSameDefaultUntouched: {
      type: "string",
      description: "Linked same default untouched",
      nullable: true,
    },
    linkedSameOnValidate: {
      type: "string",
      description: "Linked same on validate",
      nullable: true,
    },
    popup: {
      type: "object",
      description: "Popup",
      nullable: true,
      properties: popupSchema.properties,
    },
    required: { type: "boolean", description: "Required" },
  },
  required: [
    "id",
    "fieldConfigId",
    "showName",
    "type",
    "value",
    "dataUnit",
    "size",
    "hoverText",
    "dbSelect",
    "select",
    "linkedActive",
    "linkedSameDefaultUntouched",
    "linkedSameOnValidate",
    "popup",
    "required",
  ],
};

// Descriptions
export const postFieldDescription = describeRoute({
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

export const putFieldDescription = describeRoute({
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

export const putFieldsOrderDescription = describeRoute({
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

export const deleteFieldDescription = describeRoute({
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

export const putFieldConfigsDescription = describeRoute({
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

export const createConfigDescription = describeRoute({
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

export const deleteConfigDescription = describeRoute({
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

export const getFieldsConfigsIdsActiveForAnAwningDescription = describeRoute({
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

export const linkFieldConfigToAnAwningDescription = describeRoute({
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

export const unlinkFieldConfigToAnAwningDescription = describeRoute({
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

export const linkFieldConfigForAllAwningsDescription = describeRoute({
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

export const unlinkFieldConfigForAllAwningsDescription = describeRoute({
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
