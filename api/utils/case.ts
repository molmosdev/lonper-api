// deno-lint-ignore-file no-explicit-any
import _ from "npm:lodash@4.17.21";

class Case {
  /**
   * Convert the keys of an object to camel case
   * @param obj - The object to convert the keys
   * @param converter - The function to convert the keys
   * @returns The object with the keys converted
   */
  static deepConvertKeys(obj: any, converter: (key: string) => string): any {
    if (Array.isArray(obj)) {
      return obj.map((value: any) => Case.deepConvertKeys(value, converter));
    } else if (_.isObject(obj)) {
      return _.mapValues(
        _.mapKeys(obj, (_value: any, key: string) =>
          Case.isUUID(key) ? key : converter(key)
        ),
        (value: any) =>
          value === "" ? value : Case.deepConvertKeys(value, converter)
      );
    } else {
      return obj;
    }
  }

  /**
   * Convert a string to camel case
   * @param str - The string to convert
   * @returns The string in camel case
   */
  static toCamelCase(str: string): string {
    return _.camelCase(str);
  }

  /**
   * Convert a string to upper snake case
   * @param str - The string to convert
   * @returns The string in upper snake case
   */
  static toUpperSnakeCase(str: string): string {
    return _.snakeCase(str).toUpperCase();
  }

  /**
   * Check if a string is a UUID
   * @param str - The string to check
   * @returns True if the string is a UUID, false otherwise
   */
  static isUUID(str: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }
}

export default Case;
