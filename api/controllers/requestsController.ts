import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { IFilter, IRequest } from "@lonper/types";

class RequestsController {
  static async postRequest(c: Context) {
    try {
      const body: IRequest = await c.req.json();
      const { data, error } = await config.database
        .from("REQUESTS")
        .insert(Case.deepConvertKeys(body, Case.toUpperSnakeCase));

      if (error) {
        console.error(
          "Internal server error while creating the request:",
          error,
        );
        return c.json(
          { error: "Internal server error while creating the request." },
          400,
        );
      } else {
        console.log("Request successfully created:", data);
        return c.json(data, 201);
      }
    } catch (error) {
      console.error("Internal server error while creating the request:", error);
      return c.json(
        { error: "Internal server error while creating the request." },
        500,
      );
    }
  }

  static async getRequests(c: Context) {
    const email = c.get("user").email;
    const {
      filters = "",
      sortedBy = "deliveryDate:asc",
      limit = 10,
      offset = 0,
    } = c.req.query();

    try {
      let query = config.database
        .from("REQUESTS")
        .select("*")
        .eq("EMAIL", email);

      if (filters) {
        const filtersArray: IFilter[] = JSON.parse(filters);
        filtersArray.forEach((filter) => {
          if (filter.column && filter.value !== undefined) {
            const columnName = Case.toUpperSnakeCase(filter.column);

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
      console.error("Internal server error:", error);
      return c.json({ error: "Internal server error fetching requests." }, 500);
    }
  }
}

export default RequestsController;
