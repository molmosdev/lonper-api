import config from "../config.ts";

// deno-lint-ignore no-explicit-any
type Record = { [key: string]: any };

class Utils {
  /**
   * Update or insert records in the specified table.
   * @param tableName - The name of the table.
   * @param records - The records to update or insert.
   * @param matchColumn - The column to match records on.
   * @param id - The ID to match records on.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  static async updateOrInsert(
    tableName: string,
    records: Record[],
    matchColumn: string,
    id: string
  ): Promise<void> {
    const { data: existingRecords, error } = await config.database
      .from(tableName)
      .select("*")
      .eq(matchColumn, id);

    if (error) {
      console.error("Error al obtener los registros existentes:", error);
      throw error;
    }

    if (existingRecords.length > 0) {
      if (records && records.length > 0) {
        await Utils.update(tableName, records, matchColumn, id);
      } else {
        await Utils.delete(tableName, matchColumn, id);
      }
    } else if (records && records.length > 0) {
      await Utils.insert(tableName, records, id);
    }
  }

  /**
   * Dynamically update records in the specified table.
   * @param tableName - The name of the table.
   * @param records - The records to update.
   * @param matchColumn - The column to match records on.
   * @param id - The ID to match records on.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  static async dynamicUpdate(
    tableName: string,
    records: Record[],
    matchColumn: string,
    id: string
  ): Promise<void> {
    const { data: existingRecords, error: existingRecordsError } =
      await config.database.from(tableName).select("*").eq(matchColumn, id);

    if (existingRecordsError) {
      console.error(`Error fetching existing records: ${existingRecordsError}`);
      throw existingRecordsError;
    }

    if (records.length === 0 && existingRecords.length > 0) {
      await this.delete(tableName, matchColumn, id);
      return;
    }

    if (existingRecords.length === 0) {
      await this.insert(tableName, records, id, matchColumn);
      return;
    }

    if (existingRecords.length === records.length) {
      for (const record of records) {
        const existingRecord = existingRecords.find(
          (existingRecord: Record) => existingRecord["ID"] === record["ID"]
        );
        if (existingRecord) {
          let hasChanged = false;
          for (const prop in record) {
            if (record[prop] !== existingRecord[prop]) {
              hasChanged = true;
              break;
            }
          }
          if (hasChanged) {
            await this.update(tableName, [record], "ID", record["ID"]);
          }
        }
      }
      return;
    }

    if (existingRecords.length > records.length) {
      const idsToDelete = existingRecords
        .filter(
          (existingRecord: Record) =>
            !records.some((record) => record["ID"] === existingRecord["ID"])
        )
        .map((record: Record) => record["ID"]);
      for (const id of idsToDelete) {
        await this.delete(tableName, "ID", id);
      }
      return;
    }

    const recordsToInsert = records.filter(
      (record) =>
        !existingRecords.some(
          (existingRecord: Record) => record["ID"] === existingRecord["ID"]
        )
    );
    await this.insert(tableName, recordsToInsert, id, matchColumn);
  }

  /**
   * Insert records into the specified table.
   * @param tableName - The name of the table.
   * @param records - The records to insert.
   * @param id - The ID to associate with the records.
   * @param column - The column to associate the ID with (default is "FIELD_ID").
   * @throws Will throw an error if there is an issue with the database operation.
   */
  static async insert(
    tableName: string,
    records: Record[],
    id: string,
    column = "FIELD_ID"
  ): Promise<void> {
    if (records && records.length > 0) {
      const { error } = await config.database.from(tableName).insert(
        records.map((item) => {
          const newItem = Object.fromEntries(
            Object.entries(item).filter(([, value]) => value !== "")
          );
          return { ...newItem, [column]: id };
        })
      );

      if (error) {
        console.error("Error al insertar los registros:", error);
        throw error;
      }
    }
  }

  /**
   * Update records in the specified table.
   * @param tableName - The name of the table.
   * @param records - The records to update.
   * @param matchColumn - The column to match records on.
   * @param id - The ID to match records on.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  static async update(
    tableName: string,
    records: Record[],
    matchColumn: string,
    id: string
  ): Promise<void> {
    if (records && records.length > 0) {
      const { error } = await config.database
        .from(tableName)
        .update(records)
        .eq(matchColumn, id);

      if (error) {
        console.error("Error al actualizar los registros:", error);
        throw error;
      }
    }
  }

  /**
   * Delete records from the specified table.
   * @param tableName - The name of the table.
   * @param matchColumn - The column to match records on.
   * @param id - The ID to match records on.
   * @throws Will throw an error if there is an issue with the database operation.
   */
  static async delete(
    tableName: string,
    matchColumn: string,
    id: string
  ): Promise<void> {
    const { error } = await config.database
      .from(tableName)
      .delete()
      .eq(matchColumn, id);

    if (error) {
      console.error("Error al eliminar los registros:", error);
      throw error;
    }
  }
}

export default Utils;
