import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
const articleSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Article ID" },
    article: { type: "string", description: "Article code" },
    name: { type: "string", description: "Article name" },
    familyCode: { type: "string", description: "Family code" },
    familyDesc: { type: "string", description: "Family description" },
    subfamilyCode: { type: "string", description: "Subfamily code" },
    subfamilyDesc: { type: "string", description: "Subfamily description" },
    blqC: { type: "number", description: "Block C" },
    blqV: { type: "number", description: "Block V" },
    type: { type: "string", description: "Type" },
    subtype: { type: "string", description: "Subtype" },
    shortName: { type: "string", description: "Short name", nullable: true },
    blqVName: { type: "string", description: "Block V name", nullable: true },
    lonRate: { type: "string", description: "Lon rate" },
    lonGroup: { type: "string", description: "Lon group" },
    lonEdging: { type: "string", description: "Lon edging" },
    salePriceBeforeDiscount: {
      type: "number",
      description: "Sale price before discount",
      nullable: true,
    },
    salePrice: { type: "number", description: "Sale price" },
    unsubscribed: { type: "number", description: "Unsubscribed" },
    crtlStk: { type: "number", description: "Control stock" },
    dto1: { type: "number", description: "Discount 1" },
    dto2: { type: "number", description: "Discount 2" },
    dto3: { type: "number", description: "Discount 3" },
  },
  required: ["id", "article", "name", "familyCode", "familyDesc", "salePrice"],
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
export const getArticlesByIdsDescription = describeRoute({
  summary: "Get articles by IDs",
  description: "This endpoint retrieves articles by their IDs.",
  tags: ["Articles"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            articleIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of article IDs",
            },
          },
          required: ["articleIds"],
        },
      },
    },
  },
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
