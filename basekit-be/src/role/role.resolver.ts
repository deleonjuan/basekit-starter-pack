import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { RoleService } from "./role.service";
import { CreateRoleInput } from "./dto/create-role.input";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role], { name: "roles" })
  @RequirePermissions("read:role")
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Mutation(() => Role, { name: "createRole" })
  @RequirePermissions("create:role")
  create(@Args("input") input: CreateRoleInput): Promise<Role> {
    return this.roleService.create(input);
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

  @Query(() => [Permission], { name: "permissions" })
  @RequirePermissions("read:permission")
  findAllPermissions(): Promise<Permission[]> {
    return this.roleService.findAllPermissions();
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
