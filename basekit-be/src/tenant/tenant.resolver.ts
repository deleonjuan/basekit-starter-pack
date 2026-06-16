import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Tenant } from "./tenant.entity";
import { TenantService } from "./tenant.service";
import { PaginationInput } from "../common/dto/pagination.input";
import { PaginatedTenants } from "./types/paginated-tenants.type";
import { IPaginatedResult } from "../common/types/paginated-result.type";
import { SuperAdminOnly } from "../auth/decorators/super-admin.decorator";

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => PaginatedTenants, { name: "tenants" })
  @SuperAdminOnly()
  findAll(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
  ): Promise<IPaginatedResult<Tenant>> {
    return this.tenantService.findAll(pagination);
  }

  @Mutation(() => Tenant, { name: "deactivateTenant" })
  @SuperAdminOnly()
  deactivate(@Args("id", { type: () => ID }) id: string): Promise<Tenant> {
    return this.tenantService.deactivate(id);
  }
}
