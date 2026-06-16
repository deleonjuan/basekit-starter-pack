import { ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { User } from "../entities/user.entity";

@ObjectType()
export class PaginatedUsers extends PaginatedResult(User) {}
