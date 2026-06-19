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
import type { JwtPayload } from "../auth/jwt.strategy";
import { GraphQLJSON } from "../common/scalars/json.scalar";
import type { FilterMap } from "../common/utils/find-many.util";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUsers, { name: "users" })
  @RequirePermissions("read:user")
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
  @RequirePermissions("create:user")
  create(@Args("input") input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User, { name: "updateUser" })
  @RequirePermissions("update:user")
  update(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean, { name: "deleteUser" })
  @RequirePermissions("delete:user")
  delete(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
    return this.userService.delete(id);
  }

  @Mutation(() => User, { name: "assignRole" })
  @RequirePermissions("update:user")
  assignRole(
    @Args("userId", { type: () => ID }) userId: string,
    @Args("roleId", { type: () => ID }) roleId: string,
  ): Promise<User> {
    return this.userService.assignRole(userId, roleId);
  }

  @Mutation(() => User, { name: "revokeRole" })
  @RequirePermissions("update:user")
  revokeRole(
    @Args("userId", { type: () => ID }) userId: string,
    @Args("roleId", { type: () => ID }) roleId: string,
  ): Promise<User> {
    return this.userService.revokeRole(userId, roleId);
  }
}
