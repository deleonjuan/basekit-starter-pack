/* eslint-disable */
// server/src/common/utils/pagination.util.ts
import {
  Repository,
  FindOptionsWhere,
  ILike,
  ObjectLiteral,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Equal,
  In,
} from 'typeorm';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';

interface PaginateOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  page?: number;
  limit?: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: any;
  relations?: string[];
  searchFields?: (keyof T)[];
  search?: string;
  filters?: Record<string, any> | Array<Record<string, any>>;
}

// Helper function to check if a string is a UUID
function isUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

// Helper function to clean object from prototype properties
function cleanObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  // Create a clean object with only own properties
  const cleaned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cleaned[key] = cleanObject(obj[key]);
    }
  }
  return cleaned;
}

// Helper function to apply ILike to nested objects (but not UUIDs)
function applyILikeToFilters(obj: any): any {
  if (typeof obj === 'string') {
    // Don't apply ILIKE to UUIDs, use exact match instead
    if (isUUID(obj)) {
      return obj;
    }
    return ILike(`%${obj}%`);
  }

  // Support explicit comparison operators in filter payloads.
  // Example: { quantity: { _gt: 0 } }
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    if (keys.length === 1) {
      const [operator] = keys;
      const value = obj[operator];

      switch (operator) {
        case '_gt':
          return MoreThan(value);
        case '_gte':
          return MoreThanOrEqual(value);
        case '_lt':
          return LessThan(value);
        case '_lte':
          return LessThanOrEqual(value);
        case '_eq':
          return Equal(value);
        case '_in':
          return In(Array.isArray(value) ? value : [value]);
        default:
          break;
      }
    }
  }

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = applyILikeToFilters(value);
    }
    return result;
  }

  return obj;
}

export async function paginate<T extends ObjectLiteral>({
  repository,
  page = 1,
  limit = 10,
  where = {},
  order = {},
  relations = [],
  searchFields = [],
  search = '',
  filters = {},
}: PaginateOptions<T>): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  // Build where clause
  let whereClause: any = { ...where };

  // Apply search across multiple fields
  if (search && searchFields.length > 0) {
    whereClause = searchFields.map((field) => ({
      ...whereClause,
      [field]: ILike(`%${search}%`),
    }));
  }

  // Apply generic filters with ILike for string values (except UUIDs)
  if (
    filters &&
    (Array.isArray(filters)
      ? filters.length > 0
      : Object.keys(filters).length > 0)
  ) {
    // Clean filters first to remove prototype properties
    const cleanedFilters = cleanObject(filters);

    if (Array.isArray(cleanedFilters)) {
      // Array format: OR logic - each item in the array becomes a separate OR condition
      const filterClauses = cleanedFilters.map((filterObj) => {
        const processedFilter = applyILikeToFilters(filterObj);
        return {
          ...(Array.isArray(whereClause) ? {} : whereClause),
          ...processedFilter,
        };
      });

      // If whereClause is already an array (from search), we need to combine them
      if (Array.isArray(whereClause)) {
        // Combine search conditions with filter conditions using OR
        whereClause = [...whereClause, ...filterClauses];
      } else {
        whereClause = filterClauses;
      }
    } else {
      // Object format: AND logic (existing behavior)
      const processedFilters = applyILikeToFilters(cleanedFilters);

      if (Array.isArray(whereClause)) {
        whereClause = whereClause.map((clause) => ({
          ...clause,
          ...processedFilters,
        }));
      } else {
        whereClause = {
          ...whereClause,
          ...processedFilters,
        };
      }
    }
  }

  const [data, total] = await repository.findAndCount({
    where: whereClause,
    order,
    relations,
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
