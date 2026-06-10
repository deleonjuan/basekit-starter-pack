import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Tenant } from "./tenant.entity";
import { TenantService } from "./tenant.service";
import { SuperAdminOnly } from "../auth/decorators/super-admin.decorator";

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant], { name: "tenants" })
  @SuperAdminOnly()
  findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Mutation(() => Tenant, { name: "deactivateTenant" })
  @SuperAdminOnly()
  deactivate(@Args("id", { type: () => ID }) id: string): Promise<Tenant> {
    return this.tenantService.deactivate(id);
  }
}
