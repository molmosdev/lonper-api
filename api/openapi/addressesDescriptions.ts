import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
const addressSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Address ID" },
    city: { type: "string", description: "City name" },
    country: { type: "string", description: "Country name" },
    postalCode: { type: "string", description: "Postal code" },
    province: { type: "string", description: "Province name" },
    streetAndNumber: { type: "string", description: "Street and number" },
  },
  required: ["city", "country", "postalCode", "province", "streetAndNumber"],
};

const errorResponseSchema = {
  type: "object",
  properties: {
    code: { type: "integer", format: "int32", description: "HTTP error code" },
    message: { type: "string", description: "Detailed error message" },
  },
  required: ["code", "message"],
};

const successMessageSchema = {
  type: "object",
  properties: {
    message: { type: "string", description: "Success message" },
  },
};

// Descriptions
export const getAddressesDescription = describeRoute({
  summary: "Get addresses",
  description: "This endpoint retrieves the addresses of the current user.",
  tags: ["Addresses"],
  responses: {
    200: {
      description: "Addresses retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: addressSchema,
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

export const postAddressDescription = describeRoute({
  summary: "Add a new address",
  description: "This endpoint allows adding a new address.",
  tags: ["Addresses"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: addressSchema,
      },
    },
  },
  responses: {
    200: {
      description: "Address added successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
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

export const putAddressDescription = describeRoute({
  summary: "Update an address",
  description: "This endpoint allows updating an existing address.",
  tags: ["Addresses"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: addressSchema,
      },
    },
  },
  responses: {
    200: {
      description: "Address updated successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
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

export const deleteAddressDescription = describeRoute({
  summary: "Delete an address",
  description: "This endpoint allows deleting an existing address.",
  tags: ["Addresses"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            addressId: { type: "string", description: "Address ID" },
          },
          required: ["addressId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Address deleted successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    404: {
      description: "Address not found",
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
