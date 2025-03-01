import { describeRoute } from "npm:hono-openapi@0.4.5";

// Schemas
const loginRequestSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "User's email address",
      example: "lonper.dev@gmail.com",
    },
    password: {
      type: "string",
      description: "User's password",
      example: "admin2023",
    },
  },
  required: ["email", "password"],
};

const errorResponseSchema = {
  type: "object",
  properties: {
    code: {
      type: "integer",
      format: "int32",
      description: "HTTP error code",
    },
    message: {
      type: "string",
      description: "Detailed error message",
    },
  },
  required: ["code", "message"],
};

const successMessageSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      description: "Success message",
    },
  },
};

const emailRequestSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "User's email address",
    },
  },
  required: ["email"],
};

const userResponseSchema = {
  type: "object",
  properties: {
    user: {
      type: "object",
      description: "User data",
    },
  },
};

// Descriptions
export const loginDescription = describeRoute({
  summary: "Log in a user",
  description: "This endpoint allows a user to log in.",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: loginRequestSchema,
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: successMessageSchema,
        },
      },
    },
    401: {
      description: "Invalid credentials",
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

export const logoutDescription = describeRoute({
  summary: "Log out a user",
  description: "This endpoint allows a user to log out.",
  tags: ["Auth"],
  responses: {
    200: {
      description: "User logged out successfully",
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

export const sendPasswordResetEmailDescription = describeRoute({
  summary: "Send a password reset email",
  description: "This endpoint allows sending a password reset email.",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: emailRequestSchema,
      },
    },
  },
  responses: {
    200: {
      description: "Password reset email sent successfully",
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

export const getCurrentUserDescription = describeRoute({
  summary: "Get the current user",
  description: "This endpoint returns the current authenticated user.",
  tags: ["Auth"],
  responses: {
    200: {
      description: "User found",
      content: {
        "application/json": {
          schema: userResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
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
