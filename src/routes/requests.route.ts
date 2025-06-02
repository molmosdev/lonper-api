import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  getRequestsDesc,
  postRequestDesc,
} from "../openapi/descriptions/requestsDescriptions";
import {
  CommercialData,
  IFilter,
  IRequest,
  User,
  UserMetadata,
} from "@lonper/types";
import Case from "../utils/case";
import { clientMetadataMiddleware } from "../middlewares/client-metadata.middleware";

const app = new Hono();

app.post(
  "/",
  userMiddleware,
  postRequestDesc,
  clientMetadataMiddleware,
  async (c: Context) => {
    const user = c.get("user");
    const clientMetadata = c.get("clientMetadata");
    const commercialData: CommercialData =
      clientMetadata?.commercialData ||
      user.user_metadata?.commercialData ||
      {};
    const supabase = c.get("supabase");

    try {
      const body: IRequest = await c.req.json();
      body.clientNumber = commercialData.clientNumber || 0;
      body.clientName = commercialData.commercialDesc || "";
      console.log("Creating request with body:", body);
      const { data, error } = await supabase
        .from("REQUESTS")
        .insert(Case.deepConvertKeys(body, Case.toUpperSnakeCase));

      if (error) {
        console.error("Error creating request:", error);
        return c.json({ error: "Error creating request." }, 400);
      }

      console.log("Request created successfully:", data);
      return c.json(data, 201);
    } catch (error) {
      console.error("Internal server error while creating request:", error);
      return c.json(
        { error: "Internal server error while creating request." },
        500
      );
    }
  }
);

app.get("/", userMiddleware, getRequestsDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const user: User = c.get("user");
  const clientNumber = user.user_metadata?.commercialData?.clientNumber;
  const {
    filters = "",
    sortedBy = "deliveryDate:asc",
    limit = 10,
    offset = 0,
  } = c.req.query();

  try {
    let query = supabase.from("REQUESTS").select("*");

    // Only include clientNumber filter for non-advanced workers
    if (user.role !== "lonper_worker_advanced") {
      query = query.eq("CLIENT_NUMBER", clientNumber);
    }

    if (filters) {
      const filtersArray: IFilter[] = JSON.parse(filters);
      filtersArray.forEach((filter) => {
        if (filter.column && filter.value !== undefined) {
          const columnName = Case.toUpperSnakeCase(filter.column);
          console.log("Applying filter:", columnName, filter.value);

          if (typeof filter.value === "boolean") {
            query = query.eq(columnName, filter.value);
          } else if (
            filter.column.toLowerCase().includes("date") &&
            filter.value
          ) {
            query = query.gte(columnName, filter.value);
          } else {
            query = query.ilike(columnName, `%${filter.value}%`);
          }
        }
      });
    }

    if (sortedBy) {
      const [column, direction] = sortedBy.split(":");
      if (column && ["asc", "desc"].includes(direction)) {
        query = query.order(Case.toUpperSnakeCase(column), {
          ascending: direction === "asc",
        });
      }
    }

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching requests:", error);
      return c.json({ error: "Error fetching requests." }, 400);
    }

    const requests: IRequest[] = Case.deepConvertKeys(data, Case.toCamelCase);
    return c.json(requests, 200);
  } catch (error) {
    console.error("Internal server error while fetching requests:", error);
    return c.json(
      { error: "Internal server error while fetching requests." },
      500
    );
  }
});

export default app;
