import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { PaginationInput } from "../common/dto/pagination.input";
import { PaginatedUsers } from "./types/paginated-users.type";
import { IPaginatedResult } from "../common/types/paginated-result.type";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { CurrentTenant } from "../tenant/tenant.decorator";
import { TenantService } from "../tenant/tenant.service";
import type { JwtPayload } from "../auth/jwt.strategy";
import { GraphQLJSON } from "../common/scalars/json.scalar";
import type { FilterMap } from "../common/utils/find-many.util";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
  ) {}

  @Public()
  @Mutation(() => User, { name: "registerFirstUser" })
  async registerFirstUser(
    @CurrentTenant() slug: string,
    @Args("input") input: CreateUserInput,
  ): Promise<User> {
    const tenant = await this.tenantService.findBySlug(slug);
    const enabled =
      tenant?.configuration?.featureFlags?.["enableFirstUserCreation"];
    if (!enabled) throw new Error("First user registration is not enabled.");
    return this.userService.registerFirstUser(input);
  }

  @Query(() => PaginatedUsers, { name: "users" })
  @RequirePermissions("users:read")
  findAll(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("search", { nullable: true }) search?: string,
    @Args("filters", { nullable: true, type: () => GraphQLJSON })
    filters?: FilterMap,
  ): Promise<IPaginatedResult<User>> {
    return this.userService.findAll(pagination, search, undefined, filters);
  }

  @Query(() => User, { nullable: true, name: "user" })
  findOne(@Args("id", { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User, { name: "me" })
  me(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.userService.findOne(user.sub);
  }

  @Mutation(() => User, { name: "createUser" })
  @RequirePermissions("users:write")
  create(@Args("input") input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User, { name: "updateUser" })
  @RequirePermissions("users:write")
  update(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean, { name: "deleteUser" })
  @RequirePermissions("users:delete")
  delete(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
    return this.userService.delete(id);
  }

  @Mutation(() => User, { name: "assignRole" })
  @RequirePermissions("users.roles:write")
  assignRole(
    @Args("userId", { type: () => ID }) userId: string,
    @Args("roleId", { type: () => ID }) roleId: string,
  ): Promise<User> {
    return this.userService.assignRole(userId, roleId);
  }

  @Mutation(() => User, { name: "revokeRole" })
  @RequirePermissions("users.roles:write")
  revokeRole(
    @Args("userId", { type: () => ID }) userId: string,
    @Args("roleId", { type: () => ID }) roleId: string,
  ): Promise<User> {
    return this.userService.revokeRole(userId, roleId);
  }
}
