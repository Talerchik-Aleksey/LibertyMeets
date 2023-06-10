import { Model } from "sequelize-typescript";

/**
 * This method wraps a data loader for doing extra manipulation over Date objects: it converts
 * instances of Date into String using `.toISOString()` method.
 * It is necessary for JSON serialization since JS doesn't know how to serialize Date into String.
 * @param fn
 * @param dateFields
 */
export async function backendLoader<T extends Model>(
  fn: () => Promise<T | null>,
  dateFields: string[]
): Promise<T | null> {
  try {
    const entity = await fn();
    if (!entity) {
      return null;
    }
    const plainData = await entity.toJSON();
    return dateFields.reduce((acc, field) => {
      acc[field] = acc[field].toISOString();
      return acc;
    }, plainData);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function backendLoaderArray<T extends Model[]>(
  fn: () => Promise<T | null>,
  dateFields: string[]
): Promise<T | null> {
  try {
    const entities = await fn();
    if (!entities) {
      return null;
    }
    const plainDataArray = await Promise.all(
      entities.map(async (entity) => {
        const plainData = await entity.toJSON();
        convertDatesToJson(plainData, dateFields);
        return plainData;
      })
    );
    return plainDataArray as T;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function convertDatesToJson(data: any, dateFields: string[]) {
  for (const field of dateFields) {
    const nestedFields = field.split(".");
    let nestedData = data;
    for (const nestedField of nestedFields) {
      nestedData = nestedData[nestedField];
      if (!nestedData) {
        break;
      }
    }
    if (nestedData instanceof Date) {
      const parentData = nestedFields
        .slice(0, -1)
        .reduce((obj, key) => obj[key], data);
      parentData[nestedFields[nestedFields.length - 1]] =
        nestedData.toISOString();
    } else if (typeof nestedData === "object") {
      convertDatesToJson(nestedData, nestedFields.slice(1));
    }
  }
}
