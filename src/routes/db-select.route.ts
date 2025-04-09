import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import { getDbSelectResultsDesc } from "../openapi/descriptions/dbSelectDescriptions";
import Case from "../utils/case";

const app = new Hono();

app.get("/", userMiddleware, getDbSelectResultsDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { search, tableName, columns, ...filters } = c.req.query();
    const columnsArray = columns.split(",");

    let query = supabase.from(tableName).select();

    Object.entries(filters).forEach(([key, value]) => {
      if (key.startsWith("filter")) {
        const [filterColumn, operator, filterValue] = value.split(/(=|!=)/);
        if (filterColumn) {
          if (filterValue === "null") {
            query =
              operator === "="
                ? query.is(filterColumn, null)
                : query.not(filterColumn, "is", null);
          } else {
            query =
              operator === "="
                ? query.eq(filterColumn, filterValue)
                : query.neq(filterColumn, filterValue);
          }
        }
      }
    });

    query.or(
      columnsArray.map((column) => `${column}.ilike.%${search}%`).join(", ")
    );

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return c.json({ error: "Error while retrieving database results." }, 400);
    }

    return c.json(Case.deepConvertKeys(data, Case.toCamelCase), 200);
  } catch (error) {
    console.error("Internal server error:", error);
    return c.json(
      { error: "Internal server error while retrieving database results." },
      500
    );
  }
});

export default app;
