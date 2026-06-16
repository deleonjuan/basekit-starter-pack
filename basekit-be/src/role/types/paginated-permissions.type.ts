import { ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { Permission } from "../entities/permission.entity";

@ObjectType()
export class PaginatedPermissions extends PaginatedResult(Permission) {}
