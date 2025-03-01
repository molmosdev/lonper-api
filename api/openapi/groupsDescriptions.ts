import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
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

const fieldConfigSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Field Config ID" },
    fieldId: { type: "string", description: "Field ID" },
    fieldsSubconfigs: {
      type: "array",
      items: fieldSubconfigSchema,
    },
  },
  required: ["id", "fieldId", "fieldsSubconfigs"],
};

const fieldSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Field ID" },
    order: { type: "number", description: "Field order" },
    groupId: { type: "string", description: "Group ID" },
    name: { type: "string", description: "Field name" },
    description: {
      type: "string",
      description: "Field description",
      nullable: true,
    },
    saveOnRequest: { type: "boolean", description: "Save on request" },
    fieldsConfigs: {
      type: "array",
      items: fieldConfigSchema,
    },
  },
  required: [
    "id",
    "order",
    "groupId",
    "name",
    "saveOnRequest",
    "fieldsConfigs",
  ],
};

const groupSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Group ID" },
    name: { type: "string", description: "Group name" },
    order: { type: "number", description: "Group order" },
    fields: {
      type: "array",
      items: fieldSchema,
    },
  },
  required: ["id", "name", "order", "fields"],
};

const errorResponseSchema = {
  type: "object",
  properties: {
    code: { type: "integer", format: "int32", description: "HTTP error code" },
    message: { type: "string", description: "Detailed error message" },
  },
  required: ["code", "message"],
};

// Descriptions
export const getGroupsDescription = describeRoute({
  summary: "Get all groups",
  description: "This endpoint retrieves all groups.",
  tags: ["Groups"],
  responses: {
    200: {
      description: "Groups retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: groupSchema,
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

export const getGroupsForAnAwningDescription = describeRoute({
  summary: "Get groups for an awning",
  description: "This endpoint retrieves groups for a specific awning.",
  tags: ["Groups"],
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
      description: "Groups retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: groupSchema,
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

export const postGroupDescription = describeRoute({
  summary: "Create a new group",
  description: "This endpoint creates a new group.",
  tags: ["Groups"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Group name" },
          },
          required: ["name"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Group created successfully",
      content: {
        "application/json": {
          schema: groupSchema,
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

export const putGroupDescription = describeRoute({
  summary: "Update a group",
  description: "This endpoint updates a group.",
  tags: ["Groups"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Group ID" },
            name: { type: "string", description: "Group name" },
          },
          required: ["id", "name"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Group updated successfully",
      content: {
        "application/json": {
          schema: groupSchema,
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

export const deleteGroupDescription = describeRoute({
  summary: "Delete a group",
  description: "This endpoint deletes a group.",
  tags: ["Groups"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Group ID" },
          },
          required: ["id"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Group deleted successfully",
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

export const putGroupsOrderDescription = describeRoute({
  summary: "Update groups order",
  description: "This endpoint updates the order of groups.",
  tags: ["Groups"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            previousIndex: { type: "number", description: "Previous index" },
            currentIndex: { type: "number", description: "Current index" },
          },
          required: ["previousIndex", "currentIndex"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Groups order updated successfully",
      content: {
        "text/plain": {
          schema: {
            type: "string",
            example: "Groups updated successfully",
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
