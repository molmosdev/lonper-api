import { describeRoute } from "hono-openapi";
import {
  addressSchema,
  errorResponseSchema,
  successMessageSchema,
} from "../schemas";

export const getAddressesDesc = describeRoute({
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

export const postAddressDesc = describeRoute({
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

export const putAddressDesc = describeRoute({
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

export const deleteAddressDesc = describeRoute({
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
