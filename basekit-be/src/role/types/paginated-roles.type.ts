import { ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { Role } from "../entities/role.entity";

@ObjectType()
export class PaginatedRoles extends PaginatedResult(Role) {}
