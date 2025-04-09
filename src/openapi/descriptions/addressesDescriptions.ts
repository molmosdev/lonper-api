import { describeRoute } from "hono-openapi";
import {
  addressSchema,
  errorResponseSchema,
  successMessageSchema,
} from "../schemas";

export const getAddressesDesc = describeRoute({
  summary: "Retrieve User Addresses",
  description:
    "Fetches all addresses associated with the currently authenticated user.",
  tags: ["Addresses"],
  responses: {
    200: {
      description: "Addresses retrieved successfully.",
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
      description: "An error occurred while retrieving the addresses.",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const postAddressDesc = describeRoute({
  summary: "Create a New Address",
  description:
    "Allows the authenticated user to add a new address to their account.",
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
      description: "Address added successfully.",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    500: {
      description: "An error occurred while adding the address.",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const putAddressDesc = describeRoute({
  summary: "Update an Existing Address",
  description:
    "Allows the authenticated user to update the details of an existing address.",
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
      description: "Address updated successfully.",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    500: {
      description: "An error occurred while updating the address.",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const deleteAddressDesc = describeRoute({
  summary: "Delete an Address",
  description: "Allows the authenticated user to delete an address by its ID.",
  tags: ["Addresses"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            addressId: {
              type: "string",
              description: "The unique ID of the address to delete.",
            },
          },
          required: ["addressId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Address deleted successfully.",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    404: {
      description: "The specified address was not found.",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: "An error occurred while deleting the address.",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
