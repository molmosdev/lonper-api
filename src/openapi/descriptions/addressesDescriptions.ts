import { describeRoute } from "hono-openapi";

export const getAddressesDesc = describeRoute({
  tags: ["Addresses"],
  summary: "Get client addresses",
  description:
    "Returns the list of addresses associated with the authenticated client.",
  responses: {
    200: {
      description: "List of client addresses",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TERCERO: { type: "integer", example: 25 },
                DIRECCION: { type: "integer", example: 1 },
                DIR_CLASE: { type: "integer", example: 1 },
                NOMBRE_R_SOCIAL: {
                  type: "string",
                  example: "RUDIGER GOTTWALD",
                },
                NIF: { type: "string", example: "X4292354W" },
                DIRECCION_2: { type: "string", example: "" },
                DIR_COMPLETA: { type: "string", example: "CL  MAYOR 24" },
                LOCALIDAD: { type: "string", example: "08018393" },
                TITULO_LOCALIDAD: { type: "string", example: "CASTELLDEFELS" },
                CODIGO_POSTAL: { type: "string", example: "08860" },
                DIR_TELEFONO01: { type: "string", example: "936360960" },
                DIR_TELEFONO02: { type: "string", example: "651513432" },
                DIR_TELEFAX: { type: "string", example: "936656311" },
                ID_LOCAL: { type: "integer", example: 4437 },
                COLONIA: { type: "string", example: "" },
                TITULO_PROVINCIA: { type: "string", example: "BARCELONA" },
                DIR_DEFECTO: { type: "integer", example: 1 },
              },
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
              error: {
                type: "string",
                example: "Error processing the request",
              },
            },
          },
        },
      },
    },
  },
});

export const postAddressDesc = describeRoute({
  tags: ["Addresses"],
  summary: "Add an address to a client",
  description: "Inserts a new address for the authenticated client.",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["direccion", "dir_nombre"],
          properties: {
            direccion: {
              type: "integer",
              example: 123,
              description: "Address code",
            },
            dir_nombre: {
              type: "string",
              example: "Calle Falsa 123",
              description: "Address name",
            },
            dir_nombre2: {
              type: "string",
              example: "Piso 4ºA",
              description: "Additional address information",
            },
            telefono1: {
              type: "string",
              example: "600123456",
              description: "Primary phone",
            },
            telefono2: {
              type: "string",
              example: "931234567",
              description: "Secondary phone",
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Address successfully added",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              id: { type: "integer", example: 456 },
            },
          },
        },
      },
    },
    400: {
      description: "Validation error (required fields)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Fields 'direccion' and 'dir_nombre' are required",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal error or insertion failure",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: {
                type: "string",
                example: "Could not save the address",
              },
            },
          },
        },
      },
    },
  },
});
