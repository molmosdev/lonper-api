import { Context } from "hono";
import Case from "@utils/case.ts";
import config from "@config";

class DbSelectController {
  /**
   * Retrieves DB Select results based on search criteria.
   * @param c - Hono context object.
   * @returns JSON response with the DB Select results or an error message.
   */
  static async getDbSelectResults(c: Context) {
    try {
      const { search, tableName, columns, ...filters } = c.req.query();
      const columnsArray = columns.split(",");

      let query = config.database.from(tableName).select();

      Object.entries(filters).forEach(([key, value]) => {
        if (key.startsWith("filter")) {
          const [filterColumn, operator, filterValue] = value.split(/(=|!=)/);
          if (filterColumn) {
            if (filterValue === "null") {
              query = operator === "="
                ? query.is(filterColumn, null)
                : query.not(filterColumn, "is", null);
            } else {
              query = operator === "="
                ? query.eq(filterColumn, filterValue)
                : query.neq(filterColumn, filterValue);
            }
          }
        }
      });

      query.or(
        columnsArray.map((column) => `${column}.ilike.%${search}%`).join(", "),
      );

      const { data, error } = await query;

      if (error) {
        console.error("error", error);
        return c.json(
          { error: "Error when obtaining the awning models." },
          400,
        );
      }

      return c.json(Case.deepConvertKeys(data, Case.toCamelCase));
    } catch (error) {
      console.error("error", error);
      return c.json(
        {
          error: "Internal server error when obtaining the search results.",
        },
        500,
      );
    }
  }
}

export default DbSelectController;
