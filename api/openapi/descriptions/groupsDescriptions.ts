import { describeRoute } from "npm:hono-openapi@0.4.5";
import { errorResponseSchema, groupSchema } from "@openapi/schemas.ts";

export const getGroupsDesc = describeRoute({
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

export const getGroupsForAnAwningDesc = describeRoute({
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

export const postGroupDesc = describeRoute({
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

export const putGroupDesc = describeRoute({
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

export const deleteGroupDesc = describeRoute({
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

export const putGroupsOrderDesc = describeRoute({
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
