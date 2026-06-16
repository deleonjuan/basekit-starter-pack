import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export interface IPaginatedResult<T> {
  data: T[];
  page: number;
  total: number;
  perPage: number;
  totalPages: number;
}

export function PaginatedResult<T>(
  classRef: Type<T>,
): Type<IPaginatedResult<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResultClass implements IPaginatedResult<T> {
    @Field(() => [classRef])
    data!: T[];

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    perPage!: number;

    @Field(() => Int)
    totalPages!: number;
  }

  return PaginatedResultClass as Type<IPaginatedResult<T>>;
}
