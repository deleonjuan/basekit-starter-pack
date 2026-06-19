import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { RoleService } from "./role.service";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { PaginatedRoles } from "./types/paginated-roles.type";
import { PaginatedPermissions } from "./types/paginated-permissions.type";
import { IPaginatedResult } from "../common/types/paginated-result.type";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { GraphQLJSON } from "../common/scalars/json.scalar";
import type { FilterMap } from "../common/utils/find-many.util";

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => PaginatedRoles, { name: "roles" })
  @RequirePermissions("read:role")
  findAll(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("search", { nullable: true }) search?: string,
    @Args("filters", { nullable: true, type: () => GraphQLJSON })
    filters?: FilterMap,
  ): Promise<IPaginatedResult<Role>> {
    return this.roleService.findAll(pagination, search, undefined, filters);
  }

  @Query(() => Role, { name: "role" })
  @RequirePermissions("read:role")
  findOne(@Args("id", { type: () => ID }) id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Mutation(() => Role, { name: "createRole" })
  @RequirePermissions("create:role")
  create(@Args("input") input: CreateRoleInput): Promise<Role> {
    return this.roleService.create(input);
  }

  @Mutation(() => Role, { name: "updateRole" })
  @RequirePermissions("update:role")
  update(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateRoleInput,
  ): Promise<Role> {
    return this.roleService.update(id, input);
  }

  @Mutation(() => Boolean, { name: "deleteRole" })
  @RequirePermissions("delete:role")
  delete(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
    return this.roleService.delete(id);
  }

  @Mutation(() => Role, { name: "assignPermission" })
  @RequirePermissions("update:role")
  assignPermission(
    @Args("roleId", { type: () => ID }) roleId: string,
    @Args("permissionId", { type: () => ID }) permissionId: string,
  ): Promise<Role> {
    return this.roleService.assignPermission(roleId, permissionId);
  }

  @Mutation(() => Role, { name: "revokePermission" })
  @RequirePermissions("update:role")
  revokePermission(
    @Args("roleId", { type: () => ID }) roleId: string,
    @Args("permissionId", { type: () => ID }) permissionId: string,
  ): Promise<Role> {
    return this.roleService.revokePermission(roleId, permissionId);
  }

  @Mutation(() => Role, { name: "syncPermissions" })
  @RequirePermissions("update:role")
  syncPermissions(
    @Args("roleId", { type: () => ID }) roleId: string,
    @Args("assign", { type: () => [ID] }) assign: string[],
    @Args("revoke", { type: () => [ID] }) revoke: string[],
  ): Promise<Role> {
    return this.roleService.syncPermissions(roleId, assign, revoke);
  }

  @Query(() => PaginatedPermissions, { name: "permissions" })
  @RequirePermissions("read:permission")
  findAllPermissions(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("search", { nullable: true }) search?: string,
    @Args("filters", { nullable: true, type: () => GraphQLJSON })
    filters?: FilterMap,
  ): Promise<IPaginatedResult<Permission>> {
    return this.roleService.findAllPermissions(
      pagination,
      search,
      undefined,
      filters,
    );
  }

  @Mutation(() => Permission, { name: "createPermission" })
  @RequirePermissions("create:permission")
  createPermission(
    @Args("value") value: string,
    @Args("description", { nullable: true }) description?: string,
  ): Promise<Permission> {
    return this.roleService.createPermission(value, description);
  }
}
