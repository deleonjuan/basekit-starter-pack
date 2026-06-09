import { Query, Resolver } from "@nestjs/graphql";
import { Tenant } from "./tenant.entity";
import { TenantService } from "./tenant.service";

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant], { name: "tenants" })
  findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }
}
