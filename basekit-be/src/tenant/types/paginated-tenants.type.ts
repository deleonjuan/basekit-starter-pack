import { ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "../../common/types/paginated-result.type";
import { Tenant } from "../tenant.entity";

@ObjectType()
export class PaginatedTenants extends PaginatedResult(Tenant) {}
