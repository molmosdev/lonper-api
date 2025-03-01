import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
const requestArticleSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Article ID" },
    order: { type: "number", description: "Order", nullable: true },
    created: {
      type: "string",
      format: "date-time",
      description: "Creation date",
    },
    name: { type: "string", description: "Article name" },
    type: {
      type: "string",
      enum: ["awning", "article", "awning-article"],
      description: "Article type",
    },
    rateBeforeDiscount: { type: "number", description: "Rate before discount" },
    units: { type: "number", description: "Units" },
    dto1: { type: "number", description: "Discount 1" },
    dto2: { type: "number", description: "Discount 2" },
    dto3: { type: "number", description: "Discount 3" },
    total: { type: "number", description: "Total" },
    state: {
      type: "string",
      enum: ["order", "budget"],
      description: "Request state",
    },
    config: { type: "any", description: "Configuration", nullable: true },
  },
  required: [
    "id",
    "created",
    "name",
    "type",
    "rateBeforeDiscount",
    "units",
    "dto1",
    "dto2",
    "dto3",
    "total",
    "state",
  ],
};

const requestAddressSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Address ID" },
    city: { type: "string", description: "City" },
    streetAndNumber: { type: "string", description: "Street and number" },
    postalCode: { type: "number", description: "Postal code" },
    province: { type: "string", description: "Province" },
    country: { type: "string", description: "Country" },
  },
  required: [
    "id",
    "city",
    "streetAndNumber",
    "postalCode",
    "province",
    "country",
  ],
};

const requestSummarySchema = {
  type: "object",
  properties: {
    totalImport: { type: ["number", "string"], description: "Total import" },
    percentageMargin: {
      type: ["number", "string"],
      description: "Percentage margin",
    },
    margin: {
      type: ["number", "string"],
      description: "Margin",
      nullable: true,
    },
    installation: { type: ["number", "string"], description: "Installation" },
    shipping: { type: ["number", "string"], description: "Shipping" },
    salesBudget: { type: ["number", "string"], description: "Sales budget" },
    salesBudgedPlusTaxes: {
      type: ["number", "string"],
      description: "Sales budget plus taxes",
      nullable: true,
    },
    observations: { type: ["number", "string"], description: "Observations" },
  },
  required: [
    "totalImport",
    "percentageMargin",
    "installation",
    "shipping",
    "salesBudget",
    "observations",
  ],
};

const requestSchema = {
  type: "object",
  properties: {
    address: { type: "object", properties: requestAddressSchema.properties },
    articles: { type: "array", items: requestArticleSchema },
    email: { type: "string", description: "User email" },
    reference: { type: "string", description: "Reference" },
    deliveryDate: {
      type: ["string", "null"],
      format: "date-time",
      description: "Delivery date",
    },
    number: { type: ["number", "null"], description: "Number" },
    type: {
      type: "string",
      enum: ["order", "budget"],
      description: "Request type",
    },
    resume: { type: "object", properties: requestSummarySchema.properties },
    active: { type: "boolean", description: "Active status" },
  },
  required: [
    "address",
    "articles",
    "email",
    "reference",
    "deliveryDate",
    "number",
    "type",
    "resume",
    "active",
  ],
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
export const postRequestDescription = describeRoute({
  summary: "Create a new request",
  description: "This endpoint creates a new request.",
  tags: ["Requests"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: requestSchema,
      },
    },
  },
  responses: {
    201: {
      description: "Request created successfully",
      content: {
        "application/json": {
          schema: requestSchema,
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

export const getRequestsDescription = describeRoute({
  summary: "Get requests",
  description: "This endpoint retrieves requests for the authenticated user.",
  tags: ["Requests"],
  responses: {
    200: {
      description: "Requests retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: requestSchema,
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
