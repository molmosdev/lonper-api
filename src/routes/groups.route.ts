import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  getGroupsDesc,
  postGroupDesc,
  putGroupDesc,
  deleteGroupDesc,
  putGroupsOrderDesc,
} from "../openapi/descriptions/groupsDescriptions";
import { IGroup } from "@lonper/types";
import Case from "../utils/case";

const app = new Hono();

app.get("/", userMiddleware, getGroupsDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { data, error } = await supabase
      .from("GROUPS")
      .select(`*, FIELDS(*, FIELDS_CONFIGS(*, FIELDS_SUBCONFIGS(*)))`)
      .order("ORDER");

    if (error) {
      console.error("Error getting groups:", error);
      return c.json({ error: "Error getting groups." }, 400);
    }

    const formattedData: IGroup[] = Case.deepConvertKeys(
      data,
      Case.toCamelCase
    );

    formattedData.forEach((group) => {
      if (group.fields) {
        group.fields.sort((a, b) => a.order - b.order);
      }
    });

    return c.json(formattedData, 200);
  } catch (error) {
    console.error("Internal server error while getting groups:", error);
    return c.json(
      { error: "Internal server error while getting groups." },
      500
    );
  }
});

app.post("/", userMiddleware, postGroupDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { name } = await c.req.json();

    const { data: groups, error: fetchError } = await supabase
      .from("GROUPS")
      .select("ID");

    if (fetchError) {
      throw fetchError;
    }

    const newOrderIndex = groups.length > 0 ? groups.length + 1 : 0;

    const { data, error } = await supabase
      .from("GROUPS")
      .insert([{ NAME: name, ORDER: newOrderIndex }]);

    if (error) {
      console.error("Error creating group:", error);
      return c.json({ error: "Error creating group." }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error("Internal server error while creating group:", error);
    return c.json(
      { error: "Internal server error while creating group." },
      500
    );
  }
});

app.put("/:id", userMiddleware, putGroupDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { name } = await c.req.json();

    const { data, error } = await supabase
      .from("GROUPS")
      .update({ NAME: name })
      .eq("ID", id);

    if (error) {
      console.error("Error updating group:", error);
      return c.json({ error: "Error updating group." }, 400);
    }

    return c.json(data, 200);
  } catch (error) {
    console.error("Internal server error while updating group:", error);
    return c.json(
      { error: "Internal server error while updating group." },
      500
    );
  }
});

app.delete("/:id", userMiddleware, deleteGroupDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { error } = await supabase.from("GROUPS").delete().eq("ID", id);

    if (error) {
      console.error("Error deleting group:", error);
      return c.json({ error: "Error deleting group." }, 400);
    }

    return c.json({ message: "Group deleted successfully" }, 200);
  } catch (error) {
    console.error("Internal server error while deleting group:", error);
    return c.json(
      { error: "Internal server error while deleting group." },
      500
    );
  }
});

app.put("/order", userMiddleware, putGroupsOrderDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { previousIndex, currentIndex } = await c.req.json();

    const { data: groups, error: fetchError } = await supabase
      .from("GROUPS")
      .select("*")
      .order("ORDER", { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    const formattedGroups: IGroup[] = Case.deepConvertKeys(
      groups,
      Case.toCamelCase
    );

    if (
      previousIndex < 0 ||
      previousIndex >= formattedGroups.length ||
      currentIndex < 0 ||
      currentIndex >= formattedGroups.length
    ) {
      return c.json({ error: "Indices out of range." }, 400);
    }

    const [movingGroup] = formattedGroups.splice(previousIndex, 1);
    formattedGroups.splice(currentIndex, 0, movingGroup);

    const updatedGroups = formattedGroups.map((group, index) => ({
      ...group,
      order: index,
    }));

    const { error: updateError } = await supabase
      .from("GROUPS")
      .upsert(Case.deepConvertKeys(updatedGroups, Case.toUpperSnakeCase), {
        onConflict: "ID",
      });

    if (updateError) {
      throw updateError;
    }

    return c.json({ message: "Groups order updated successfully" }, 200);
  } catch (error) {
    console.error("Internal server error while updating groups order:", error);
    return c.json(
      { error: "Internal server error while updating groups order." },
      500
    );
  }
});

export default app;
