import { ILike, Repository, FindOptionsWhere, ObjectLiteral } from "typeorm";
import type { IPaginatedResult } from "../types/paginated-result.type";
import type { PaginationInput } from "../dto/pagination.input";

export async function findMany<T extends ObjectLiteral>(
  repo: Repository<T>,
  { page = 1, limit = 20 }: PaginationInput = {},
  search?: string,
  searchFields?: (keyof T)[],
): Promise<IPaginatedResult<T>> {
  let where: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined;

  if (search && searchFields?.length) {
    where = searchFields.map((field) => ({
      [field]: ILike(`%${search}%`),
    })) as FindOptionsWhere<T>[];
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
