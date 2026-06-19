import {
  Equal,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
  FindOptionsWhere,
  ObjectLiteral,
} from "typeorm";
import type { IPaginatedResult } from "../types/paginated-result.type";
import type { PaginationInput } from "../dto/pagination.input";

export type FilterMap = Record<string, unknown>;

function transformValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  // Dates and primitives pass through — TypeORM treats them as exact equality
  if (typeof value !== "object" || value instanceof Date) return value;

  // Plain array → IN operator
  if (Array.isArray(value)) return In(value);

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);

  // Single-key objects are checked for comparison operator shortcuts
  if (keys.length === 1) {
    const [op] = keys;
    const val = obj[op];
    switch (op) {
      case "_gt":
        return MoreThan(val);
      case "_gte":
        return MoreThanOrEqual(val);
      case "_lt":
        return LessThan(val);
      case "_lte":
        return LessThanOrEqual(val);
      case "_eq":
        return Equal(val);
      case "_in":
        return In(Array.isArray(val) ? val : [val]);
    }
  }

  // Multi-key or non-operator object → recurse to support nested relations
  // e.g. { role: { isActive: true } }
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = transformValue(val);
  }
  return result;
}

function applyFilters(filters: FilterMap): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filters)) {
    result[key] = transformValue(value);
  }
  return result;
}

export async function findMany<T extends ObjectLiteral>(
  repo: Repository<T>,
  { page = 1, limit = 20 }: PaginationInput = {},
  search?: string,
  searchFields?: (keyof T)[],
  filters?: FilterMap,
): Promise<IPaginatedResult<T>> {
  let where: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined;

  // Search: OR across each field using ILike
  if (search && searchFields?.length) {
    where = searchFields.map((field) => ({
      [field]: ILike(`%${search}%`),
    })) as FindOptionsWhere<T>[];
  }

  // Filters: ANDed on top of every search branch (or standalone)
  if (filters && Object.keys(filters).length > 0) {
    const transformed = applyFilters(filters) as FindOptionsWhere<T>;

    if (Array.isArray(where)) {
      // Inject filters into each OR branch so they are always applied
      where = where.map((clause) => ({
        ...clause,
        ...transformed,
      }));
    } else {
      where = { ...(where ?? {}), ...transformed };
    }
  }

  const [data, total] = await repo.findAndCount({
    where,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    page,
    total,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };
}
