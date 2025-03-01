import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { IField } from "@lonper/types";

class FieldsController {
  /**
   * Creates a new field.
   * @param c - The context object.
   */
  static async postField(c: Context) {
    try {
      const { name, description, saveOnRequest, groupId } = await c.req.json();

      const { data: fields, error: fetchError } = await config.database
        .from("FIELDS")
        .select("ID")
        .eq("GROUP_ID", groupId);

      if (fetchError) {
        throw fetchError;
      }

      const newOrderIndex = fields.length > 0 ? fields.length + 1 : 0;

      const { data, error } = await config.database.from("FIELDS").insert([
        {
          NAME: name,
          DESCRIPTION: description,
          ORDER: newOrderIndex,
          GROUP_ID: groupId,
          SAVE_ON_REQUEST: saveOnRequest,
        },
      ]);

      if (error) {
        console.error("Internal server error while creating the field:", error);
        return c.json(
          { error: "Internal server error while creating the field." },
          400
        );
      } else {
        console.log("Field correctly created");
        return c.json(data, 201);
      }
    } catch (error) {
      console.error("Internal server error while creating the field:", error);
      return c.json(
        { error: "Internal server error while creating the field." },
        500
      );
    }
  }

  /**
   * Updates an existing field.
   * @param c - The context object.
   */
  static async putField(c: Context) {
    try {
      const { id, name, description, saveOnRequest } = await c.req.json();

      const { data: fields, error: fetchError } = await config.database
        .from("FIELDS")
        .update({
          NAME: name,
          DESCRIPTION: description,
          SAVE_ON_REQUEST: saveOnRequest,
        })
        .eq("ID", id);

      if (fetchError) {
        console.error(
          "Internal server error while updating the field:",
          fetchError
        );
        return c.json(
          { error: "Internal server error while updating the field." },
          400
        );
      } else {
        console.log("Field correctly updated");
        return c.json(fields, 201);
      }
    } catch (error) {
      console.error("Internal server error while updating the field:", error);
      return c.json(
        { error: "Internal server error while updating the field." },
        500
      );
    }
  }

  /**
   * Updates the order of fields within a group.
   * @param c - The context object.
   */
  static async putFieldsOrder(c: Context) {
    try {
      const { previousIndex, currentIndex, groupId } = await c.req.json();

      const { data: groupFields, error: fetchError } = await config.database
        .from("FIELDS")
        .select("*")
        .eq("GROUP_ID", groupId)
        .order("ORDER", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const formattedGroupFields = Case.deepConvertKeys(
        groupFields,
        Case.toCamelCase
      );

      if (
        previousIndex < 0 ||
        previousIndex >= formattedGroupFields.length ||
        currentIndex < 0 ||
        currentIndex >= formattedGroupFields.length
      ) {
        return c.json({ error: "Indices out of range." }, 400);
      }

      const [movingField] = formattedGroupFields.splice(previousIndex, 1);
      formattedGroupFields.splice(currentIndex, 0, movingField);

      const updatedGroupFields = formattedGroupFields.map(
        (groupField: IField, index: number) => ({
          ...groupField,
          order: index,
        })
      );

      const { error: updateError } = await config.database
        .from("FIELDS")
        .upsert(
          Case.deepConvertKeys(updatedGroupFields, Case.toUpperSnakeCase),
          {
            onConflict: "ID",
          }
        );

      if (updateError) {
        throw updateError;
      }

      console.log("Fields order correctly updated");
      return c.json({ message: "Fields order correctly updated" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while updating the field order:",
        error
      );
      return c.json(
        { error: "Internal server error while updating the field order." },
        500
      );
    }
  }

  /**
   * Deletes a field.
   * @param c - The context object.
   */
  static async deleteField(c: Context) {
    try {
      const { id } = await c.req.json();

      const { error } = await config.database
        .from("FIELDS")
        .delete()
        .eq("ID", id);

      if (error) {
        console.error("Internal server error while deleting the field:", error);
        return c.json(
          { error: "Internal server error while deleting the field." },
          400
        );
      }

      console.log("Field correctly deleted");
      return c.json({ message: "Field correctly deleted" }, 200);
    } catch (error) {
      console.error("Internal server error while deleting the field:", error);
      return c.json(
        { error: "Internal server error while deleting the field." },
        500
      );
    }
  }

  /**
   * Updates the configurations of a field.
   * @param c - The context object.
   */
  static async putFieldConfigs(c: Context) {
    try {
      const { id, configs } = await c.req.json();

      const formattedConfigs = Case.deepConvertKeys(
        configs,
        Case.toUpperSnakeCase
      );

      const { data: currentConfigIds, error: fetchError } =
        await config.database
          .from("FIELDS_SUBCONFIGS")
          .select("ID")
          .eq("FIELD_CONFIG_ID", id);

      if (fetchError) {
        console.error(
          "Internal server error while fetching the field config IDs:",
          fetchError
        );
        return c.json(
          {
            error: "Internal server error while fetching the field config IDs.",
          },
          400
        );
      }

      const currentConfigIdSet = new Set(
        currentConfigIds.map((config) => config.ID)
      );
      const formattedConfigIdSet = new Set(
        formattedConfigs.map((config: { ID: string }) => config.ID)
      );

      const newConfigs = formattedConfigs.filter(
        (config: { ID: string }) => !currentConfigIdSet.has(config.ID)
      );
      const deletedConfigs = Array.from(currentConfigIdSet).filter(
        (id) => !formattedConfigIdSet.has(id)
      );
      const updatedConfigs = formattedConfigs.filter((config: { ID: string }) =>
        currentConfigIdSet.has(config.ID)
      );

      for (const config of newConfigs) {
        const { error: insertError } = await config.database
          .from("FIELDS_SUBCONFIGS")
          .insert({
            FIELD_CONFIG_ID: id,
            DATA_UNIT: config.DATA_UNIT,
            DB_SELECT: config.DB_SELECT,
            HOVER_TEXT: config.HOVER_TEXT,
            ID: config.ID,
            LINKED_ACTIVE: config.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED: config.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: config.LINKED_SAME_ON_VALIDATE,
            POPUP: config.POPUP,
            SELECT: config.SELECT,
            SHOW_NAME: config.SHOW_NAME,
            REQUIRED: config.REQUIRED,
            SIZE: config.SIZE,
            TYPE: config.TYPE,
            VALUE: config.VALUE,
          });

        if (insertError) {
          console.error(
            "Internal server error while inserting the field config:",
            insertError
          );
          return c.json(
            {
              error: "Internal server error while inserting the field config.",
            },
            400
          );
        }
      }

      for (const config of updatedConfigs) {
        const { error: updateError } = await config.database
          .from("FIELDS_SUBCONFIGS")
          .update({
            DATA_UNIT: config.DATA_UNIT,
            DB_SELECT: config.DB_SELECT,
            HOVER_TEXT: config.HOVER_TEXT,
            LINKED_ACTIVE: config.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED: config.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: config.LINKED_SAME_ON_VALIDATE,
            POPUP: config.POPUP,
            SELECT: config.SELECT,
            SHOW_NAME: config.SHOW_NAME,
            REQUIRED: config.REQUIRED,
            SIZE: config.SIZE,
            TYPE: config.TYPE,
            VALUE: config.VALUE,
          })
          .eq("ID", config.ID);

        if (updateError) {
          console.error(
            "Internal server error while updating the field config:",
            updateError
          );
          return c.json(
            { error: "Internal server error while updating the field config." },
            400
          );
        }
      }

      for (const id of deletedConfigs) {
        const { error: deleteError } = await config.database
          .from("FIELDS_SUBCONFIGS")
          .delete()
          .eq("ID", id);

        if (deleteError) {
          console.error(
            "Internal server error while deleting the field config:",
            deleteError
          );
          return c.json(
            { error: "Internal server error while deleting the field config." },
            400
          );
        }
      }

      console.log("Field configs correctly updated");
      return c.json({ message: "Field configs correctly updated" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while updating the field configs:",
        error
      );
      return c.json(
        { error: "Internal server error while updating the field configs." },
        500
      );
    }
  }

  /**
   * Creates a new configuration for a field.
   * @param c - The context object.
   */
  static async createConfig(c: Context) {
    try {
      const { id } = await c.req.json();

      const { data, error } = await config.database
        .from("FIELDS_CONFIGS")
        .insert({ FIELD_ID: id });

      if (error) {
        console.error(
          "Internal server error while creating the config:",
          error
        );
        return c.json(
          { error: "Internal server error while creating the config." },
          400
        );
      }

      console.log("Config correctly created");
      return c.json(data, 201);
    } catch (error) {
      console.error("Internal server error while creating the config:", error);
      return c.json(
        { error: "Internal server error while creating the config." },
        500
      );
    }
  }

  /**
   * Deletes a configuration of a field.
   * @param c - The context object.
   */
  static async deleteConfig(c: Context) {
    try {
      const { id } = await c.req.json();

      const { error } = await config.database
        .from("FIELDS_CONFIGS")
        .delete()
        .eq("ID", id);

      if (error) {
        console.error(
          "Internal server error while deleting the config:",
          error
        );
        return c.json(
          { error: "Internal server error while deleting the config." },
          400
        );
      }

      console.log("Config correctly deleted");
      return c.json({ message: "Config correctly deleted" }, 200);
    } catch (error) {
      console.error("Internal server error while deleting the config:", error);
      return c.json(
        { error: "Internal server error while deleting the config." },
        500
      );
    }
  }

  /**
   * Gets the active field configuration IDs for a specific awning.
   * @param c - The context object.
   */
  static async getFieldsConfigsIdsActiveForAnAwning(c: Context) {
    try {
      const { awningId } = c.req.param();

      const { data, error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("FIELD_CONFIG_ID")
        .eq("AWNING_ID", awningId);

      const formattedData = Case.deepConvertKeys(
        (data ?? []).map((item) => item["FIELD_CONFIG_ID"]),
        Case.toCamelCase
      );

      if (error) {
        console.error(
          "Internal server error while getting the active fields for the awning:",
          error
        );
        return c.json(
          {
            error:
              "Internal server error while getting the active fields for the awning.",
          },
          400
        );
      }

      console.log("Active fields correctly obtained for the awning");
      return c.json(formattedData, 200);
    } catch (error) {
      console.error(
        "Internal server error while getting the active fields for the awning:",
        error
      );
      return c.json(
        {
          error:
            "Internal server error while getting the active fields for the awning.",
        },
        500
      );
    }
  }

  /**
   * Links a field configuration to an awning.
   * @param c - The context object.
   */
  static async linkFieldConfigToAnAwning(c: Context) {
    try {
      const { fieldsIdsToUnlink, fieldIdToLink, awningId } = await c.req.json();

      const deletePromises = fieldsIdsToUnlink.map(async (fieldId: string) => {
        const { error } = await config.database
          .from("AWNINGS_FIELDS_CONFIGS")
          .delete()
          .match({ FIELD_CONFIG_ID: fieldId, AWNING_ID: awningId });

        if (error) {
          console.error(
            `Internal server error while unlinking the field config ${fieldId} from the awning ${awningId}:`,
            error
          );
        }
      });

      await Promise.all(deletePromises);

      const { error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .insert({ FIELD_CONFIG_ID: fieldIdToLink, AWNING_ID: awningId });

      if (error) {
        console.error(
          `Internal server error while linking the field config ${fieldIdToLink} to the awning ${awningId}:`,
          error
        );
        return c.json(
          {
            error:
              "Internal server error while linking the field config to the awning.",
          },
          400
        );
      }

      console.log("Field correctly linked to the awning");
      return c.json({ message: "Field correctly linked to the awning" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while linking the field config to the awning:",
        error
      );
      return c.json(
        {
          error:
            "Internal server error while linking the field config to the awning.",
        },
        500
      );
    }
  }

  /**
   * Unlinks a field configuration from an awning.
   * @param c - The context object.
   */
  static async unlinkFieldConfigToAnAwning(c: Context) {
    try {
      const { fieldIdToUnlink, awningId } = await c.req.json();

      const { error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .delete()
        .match({ FIELD_CONFIG_ID: fieldIdToUnlink, AWNING_ID: awningId });

      if (error) {
        console.error(
          `Internal server error while unlinking the field config ${fieldIdToUnlink} from the awning ${awningId}:`,
          error
        );
        return c.json(
          {
            error:
              "Internal server error while unlinking the field config from the awning.",
          },
          400
        );
      }

      console.log("Field correctly unlinked from the awning");
      return c.json(
        { message: "Field correctly unlinked from the awning" },
        200
      );
    } catch (error) {
      console.error(
        "Internal server error while unlinking the field config from the awning:",
        error
      );
      return c.json(
        {
          error:
            "Internal server error while unlinking the field config from the awning.",
        },
        500
      );
    }
  }

  /**
   * Links a field configuration to all awnings.
   * @param c - The context object.
   */
  static async linkFieldConfigForAllAwnings(c: Context) {
    try {
      const { fieldConfigId } = await c.req.json();

      const { data: AWNINGS, error: awningsError } = await config.database
        .from("AWNINGS")
        .select("ID");

      if (awningsError) {
        console.error(
          "Internal server error while getting the awnings:",
          awningsError
        );
        return c.json(
          { error: "Internal server error while getting the awnings." },
          400
        );
      }

      const insertPromises = AWNINGS.map(async (AWNING) => {
        const { data: existingField, error: existingFieldError } =
          await config.database
            .from("AWNINGS_FIELDS_CONFIGS")
            .select("ID")
            .match({ FIELD_CONFIG_ID: fieldConfigId, AWNING_ID: AWNING["ID"] });

        if (existingFieldError) {
          console.error(
            `Internal server error while checking if the field config ${fieldConfigId} is already active for the awning ${AWNING["ID"]}:`,
            existingFieldError
          );
          return;
        }

        if (existingField.length > 0) {
          console.log(
            `Field config already active for the awning ${AWNING["ID"]}`
          );
          return;
        }

        const { error } = await config.database
          .from("AWNINGS_FIELDS_CONFIGS")
          .insert({ FIELD_CONFIG_ID: fieldConfigId, AWNING_ID: AWNING["ID"] });

        if (error) {
          console.error(
            `Internal server error while activating the field config for the awning ${AWNING["ID"]}:`,
            error
          );
        }
      });

      await Promise.all(insertPromises);

      console.log("Field config correctly activated in all awnings");
      return c.json(
        { message: "Field config correctly activated in all awnings" },
        200
      );
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while activating the field config." },
        500
      );
    }
  }

  /**
   * Unlinks a field configuration from all awnings.
   * @param c - The context object.
   */
  static async unlinkFieldConfigForAllAwnings(c: Context) {
    try {
      const { fieldConfigId } = await c.req.json();

      const { error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .delete()
        .match({ FIELD_CONFIG_ID: fieldConfigId });

      if (error) {
        console.error(
          `Internal server error while unlinking the field config ${fieldConfigId} from all awnings:`,
          error
        );
        return c.json(
          {
            error:
              "Internal server error while unlinking the field config from all awnings.",
          },
          400
        );
      }

      console.log("Field correctly unlinked from all awnings");
      return c.json(
        { message: "Field correctly unlinked from all awnings" },
        200
      );
    } catch (error) {
      console.error(
        "Internal server error while unlinking the field config from all awnings:",
        error
      );
      return c.json(
        {
          error:
            "Internal server error while unlinking the field config from all awnings.",
        },
        500
      );
    }
  }
}

export default FieldsController;
