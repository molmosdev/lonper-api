export const requestArticleSchema = {
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

export const requestAddressSchema = {
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

export const requestSummarySchema = {
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

export const requestSchema = {
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

export const errorResponseSchema = {
  type: "object",
  properties: {
    code: { type: "integer", format: "int32", description: "HTTP error code" },
    message: { type: "string", description: "Detailed error message" },
  },
  required: ["code", "message"],
};

export const columnSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Column name" },
  },
  required: ["name"],
};

export const dbSelectFilterSchema = {
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

export const dbSelectSchema = {
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

export const linkedActiveSchema = {
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

export const popupSchema = {
  type: "object",
  properties: {
    activated: { type: "boolean", description: "Activated" },
    title: { type: "string", description: "Title" },
    text: { type: "string", description: "Text" },
    imgUrl: { type: "string", description: "Image URL" },
  },
  required: ["activated", "title", "text", "imgUrl"],
};

export const selectOptionSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Option name" },
    default: { type: "boolean", description: "Default option" },
  },
  required: ["name", "default"],
};

export const fieldSubconfigSchema = {
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

export const fieldConfigSchema = {
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

export const fieldSchema = {
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

export const groupSchema = {
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

export const loginRequestSchema = {
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

export const successMessageSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      description: "Success message",
    },
  },
};

export const emailRequestSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "User's email address",
    },
  },
  required: ["email"],
};

export const userResponseSchema = {
  type: "object",
  properties: {
    user: {
      type: "object",
      description: "User data",
    },
  },
};

export const awningSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Awning ID" },
    awningModelId: {
      type: "string",
      description: "Awning Model ID",
      nullable: true,
    },
    value: { type: "string", description: "Awning value" },
    familyCode: { type: "string", description: "Family code", nullable: true },
    familyDesc: {
      type: "string",
      description: "Family description",
      nullable: true,
    },
    subfamilyCode: {
      type: "string",
      description: "Subfamily code",
      nullable: true,
    },
    subfamilyDesc: {
      type: "string",
      description: "Subfamily description",
      nullable: true,
    },
  },
  required: ["id", "value"],
};

export const articleSchema = {
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

export const addressSchema = {
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
