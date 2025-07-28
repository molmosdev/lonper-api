import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  getRequestsDesc,
  postRequestDesc,
} from "../openapi/descriptions/requestsDescriptions";
import { CommercialData, IFilter, IRequest, User, IDelfosOrderRequest, RequestType, IRequestArticle } from "@lonper/types";
import Case from "../utils/case";
import { clientMetadataMiddleware } from "../middlewares/client-metadata.middleware";
import { delfosMiddleware } from "../middlewares/delfos-middleware";
import { DelfosClient } from "../services/delfos-client.service";

const app = new Hono();
const delfosClient = new DelfosClient();

app.post(
  "/",
  userMiddleware,
  postRequestDesc,
  delfosMiddleware,
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

      // If it is an order, first try to create it in Delfos
      if (body.type === RequestType.Order) {
        // 1. Gather all fieldIds used in the config of Awning articles, ignoring those with falsy values
        const awningArticles = body.articles.filter((a: IRequestArticle) => a.type === 'awning' && a.config && typeof a.config === 'object');
        const allFieldIds = Array.from(new Set(
          awningArticles.flatMap(a =>
            Object.entries(a.config)
              .filter(([_, value]) => value !== '' && value !== false && value !== null && value !== undefined)
              .map(([fieldId, _]) => fieldId)
          )
        ));
        let fieldIdToDelfosId: Record<string, string> = {};
        let fieldIdToSaveOnRequest: Record<string, boolean> = {};
        if (allFieldIds.length > 0) {
          // 2. Query Supabase to get DELFOS_ID and SAVE_ON_REQUEST
          const { data: fields, error: fieldsError } = await supabase
            .from("FIELDS")
            .select("ID,DELFOS_ID,SAVE_ON_REQUEST")
            .in("ID", allFieldIds);
          if (fieldsError) {
            console.error("Error fetching FIELDS for config mapping:", fieldsError);
            return c.json({ message: "Error fetching field mapping for Delfos." }, 500);
          } else {
            fieldIdToDelfosId = Object.fromEntries(
              fields.filter(f => f.DELFOS_ID).map(f => [f.ID, f.DELFOS_ID])
            );
            fieldIdToSaveOnRequest = Object.fromEntries(
              fields.map(f => [f.ID, f.SAVE_ON_REQUEST])
            );
          }
        }
        // 3. Map the config of Awning articles
        const mappedArticles = body.articles.map((a: IRequestArticle) => {
          if (a.type === 'awning' && a.config && typeof a.config === 'object') {
            const mappedConfig: Record<string, any> = {};
            for (const [fieldId, value] of Object.entries(a.config)) {
              if (
                value === '' ||
                value === false ||
                value === null ||
                value === undefined ||
                fieldIdToSaveOnRequest[fieldId] === false
              ) continue;
              const delfosId = fieldIdToDelfosId[fieldId];
              if (delfosId) {
                mappedConfig[delfosId] = value;
              } else {
                mappedConfig[fieldId] = value;
              }
            }
            return { ...a, config: mappedConfig };
          }
          return a;
        });
        // 4. Build the delfosOrder with the mapped articles
        const delfosOrder: IDelfosOrderRequest = {
          id: body.id!,
          reference: body.reference,
          deliveryDate: body.deliveryDate,
          client: body.clientNumber,
          address: typeof body.address === "object" ? body.address.addressId : body.address,
          articles: mappedArticles.map((a) => ({
            id: a.id,
            rateBeforeDiscount: a.rateBeforeDiscount,
            units: a.units,
            dto1: a.dto1,
            dto2: a.dto2,
            dto3: a.dto3,
            total: a.total,
            config: a.config
          })),
          resume: body.resume
        };
        try {
          await delfosClient.fetchFromDelfos(`pedido`,
            {
              method: "POST",
              body: JSON.stringify(delfosOrder)
            },
            c
          );
        } catch (delfosError) {
          console.error("Error creating order in Delfos:", delfosError);
          return c.json({ message: "Error creating order in Delfos." }, 500);
        }
      }

      // If not an order, or the Delfos call was successful, save in Supabase
      // Search for an existing budget with the same id
      let existingBudget = null;
      if (body.type === RequestType.Order && body.id) {
        const { data: found, error: findError } = await supabase
          .from("REQUESTS")
          .select("*")
          .eq("ID", body.id)
          .eq("TYPE", RequestType.Budget)
          .maybeSingle();
        if (findError) {
          console.error("Error searching for existing budget:", findError);
        }
        existingBudget = found;
      }

      let dbResult, dbError;
      if (existingBudget) {
        // If exists, update the record to order
        const { data: updated, error: updateError } = await supabase
          .from("REQUESTS")
          .update(Case.deepConvertKeys(body, Case.toUpperSnakeCase))
          .eq("ID", body.id)
          .eq("TYPE", RequestType.Budget)
          .select();
        dbResult = updated;
        dbError = updateError;
      } else {
        // If not exists, insert as new
        const { data: inserted, error: insertError } = await supabase
          .from("REQUESTS")
          .insert(Case.deepConvertKeys(body, Case.toUpperSnakeCase));
        dbResult = inserted;
        dbError = insertError;
      }

      // If there was a DB error, return immediately
      if (dbError) {
        console.error("Error creating/updating request:", dbError);
        return c.json({ message: "Error creating or updating request." }, 400);
      }

      // Success message
      let message = "Request created successfully.";
      if (existingBudget) {
        message = "Request updated from budget to order successfully.";
      }
      if (body.type === "order") {
        message += " Order sent to Delfos successfully.";
      }
      return c.json({ message }, 201);
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
