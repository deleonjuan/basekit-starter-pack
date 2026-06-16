import { Repository } from "typeorm";
import { IPaginatedResult } from "../types/paginated-result.type";
import { PaginationInput } from "../dto/pagination.input";

export async function findMany<T extends object>(
  repo: Repository<T>,
  { page = 1, limit = 20 }: PaginationInput = {},
): Promise<IPaginatedResult<T>> {
  const [data, total] = await repo.findAndCount({
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
