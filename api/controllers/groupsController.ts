import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { IField, IGroup } from "@lonper/types";

class GroupsController {
  /**
   * Get all groups.
   * @param c - Hono context object.
   * @returns JSON response with the groups data or an error message.
   */
  static async getGroups(c: Context) {
    try {
      const { data, error } = await config.database
        .from("GROUPS")
        .select(`*, FIELDS(*, FIELDS_CONFIGS(*, FIELDS_SUBCONFIGS(*)))`)
        .order("ORDER");

      if (error) {
        console.error("Internal server error while getting the groups:", error);
        return c.json(
          { error: "Internal server error while getting the groups." },
          500,
        );
      }

      const formattedData: IGroup[] = Case.deepConvertKeys(
        data,
        Case.toCamelCase,
      );

      formattedData.forEach((group) => {
        if (group.fields) {
          group.fields.sort((a, b) => a.order - b.order);
        }
      });

      return c.json(formattedData, 200);
    } catch (error) {
      console.error("Internal server error while getting the groups:", error);
      return c.json(
        { error: "Internal server error while getting the groups." },
        500,
      );
    }
  }

  /**
   * Get groups for a specific awning.
   * @param c - Hono context object.
   * @returns JSON response with the groups data or an error message.
   */
  static async getGroupsForAnAwning(c: Context) {
    try {
      const awningId = c.req.param("awningId");

      const { data: fieldConfigIdsData, error: fieldConfigIdsError } =
        await config.database
          .from("AWNINGS_FIELDS_CONFIGS")
          .select("FIELD_CONFIG_ID")
          .eq("AWNING_ID", awningId);

      if (fieldConfigIdsError) {
        console.error(
          "Internal server error while getting the active fields for the awning:",
          fieldConfigIdsError,
        );
        return c.json(
          {
            error:
              "Internal server error while getting the active fields for the awning.",
          },
          400,
        );
      }

      const fieldConfigIds = fieldConfigIdsData.map(
        (item) => item.FIELD_CONFIG_ID,
      );

      const { data, error } = await config.database
        .from("GROUPS")
        .select(`*, FIELDS(*, FIELDS_CONFIGS(*, FIELDS_SUBCONFIGS(*)))`)
        .order("ORDER");

      if (error) {
        console.error("Internal server error while getting the groups:", error);
        return c.json(
          { error: "Internal server error while getting the groups." },
          400,
        );
      }

      const groups: IGroup[] = Case.deepConvertKeys(data, Case.toCamelCase);

      const filteredGroups: IGroup[] = groups.map((group) => {
        const filteredFields = group.fields
          .map((field: IField) => {
            const filteredConfigs = field.fieldsConfigs.filter((config) =>
              fieldConfigIds.includes(config.id)
            );
            return filteredConfigs.length > 0
              ? { ...field, fieldsConfigs: filteredConfigs }
              : null;
          })
          .filter((field) => field !== null);

        return { ...group, fields: filteredFields };
      });

      filteredGroups.forEach((group) => {
        if (group.fields) {
          group.fields.sort((a, b) => a.order - b.order);
        }
      });

      return c.json(filteredGroups, 200);
    } catch (error) {
      console.error("Internal server error while getting the groups:", error);
      return c.json(
        { error: "Internal server error while getting the groups." },
        500,
      );
    }
  }

  /**
   * Create a new group.
   * @param c - Hono context object.
   * @returns JSON response with the created group data or an error message.
   */
  static async postGroup(c: Context) {
    try {
      const { name } = await c.req.json();

      const { data: groups, error: fetchError } = await config.database
        .from("GROUPS")
        .select("ID");

      if (fetchError) {
        throw fetchError;
      }

      const newOrderIndex = groups.length > 0 ? groups.length + 1 : 0;

      const { data, error } = await config.database
        .from("GROUPS")
        .insert([{ NAME: name, ORDER: newOrderIndex }]);

      if (error) {
        console.error("Internal server error while creating the group:", error);
        return c.json(
          { error: "Internal server error while creating the group." },
          400,
        );
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("Internal server error while creating the group:", error);
      return c.json(
        { error: "Internal server error while creating the group." },
        500,
      );
    }
  }

  /**
   * Update a group.
   * @param c - Hono context object.
   * @returns JSON response with the updated group data or an error message.
   */
  static async putGroup(c: Context) {
    try {
      const { id, name } = await c.req.json();

      const { data, error } = await config.database
        .from("GROUPS")
        .update({ NAME: name })
        .eq("ID", id);

      if (error) {
        console.error("Internal server error while updating the group:", error);
        return c.json(
          { error: "Internal server error while updating the group." },
          400,
        );
      }

      return c.json(data, 200);
    } catch (error) {
      console.error("Internal server error while updating the group:", error);
      return c.json(
        { error: "Internal server error while updating the group." },
        500,
      );
    }
  }

  /**
   * Delete a group.
   * @param c - Hono context object.
   * @returns JSON response with a success message or an error message.
   */
  static async deleteGroup(c: Context) {
    try {
      const { id } = await c.req.json();

      await config.database.from("GROUPS").delete().eq("ID", id);

      return c.json({ message: "Group successfully deleted" }, 200);
    } catch (error) {
      console.error("Internal server error while deleting the group:", error);
      return c.json(
        { error: "Internal server error while deleting the group." },
        500,
      );
    }
  }

  /**
   * Update the order of groups.
   * @param c - Hono context object.
   * @returns Text response with a success message or an error message.
   */
  static async putGroupsOrder(c: Context) {
    try {
      const { previousIndex, currentIndex } = await c.req.json();

      const { data: groups, error: fetchError } = await config.database
        .from("GROUPS")
        .select("*")
        .order("ORDER", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const formattedGroups: IGroup[] = Case.deepConvertKeys(
        groups,
        Case.toCamelCase,
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

      const { error: updateError } = await config.database
        .from("GROUPS")
        .upsert(Case.deepConvertKeys(updatedGroups, Case.toUpperSnakeCase), {
          onConflict: "ID",
        });

      if (updateError) {
        throw updateError;
      }

      return c.text("Groups updated successfully", 200);
    } catch (error) {
      console.error("Internal server error while updating the groups:", error);
      return c.json(
        { error: "Internal server error while updating the groups." },
        500,
      );
    }
  }
}

export default GroupsController;
