/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ContextIdFactory, ModuleRef, Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { SUPER_ADMIN_KEY } from "../decorators/super-admin.decorator";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { UserService } from "../../user/user.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext()?.req ?? ctx.switchToHttp().getRequest();
    const user = req.user;

    if (user?.isSuperAdmin) return true;

    const requiresSuperAdmin = this.reflector.getAllAndOverride<boolean>(
      SUPER_ADMIN_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (requiresSuperAdmin) throw new ForbiddenException();

    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!required?.length) return true;

    const contextId = ContextIdFactory.getByRequest(req);
    const userService = await this.moduleRef.resolve(UserService, contextId, {
      strict: false,
    });

    const userWithRoles = await userService.findWithPermissions(user.sub);
    if (!userWithRoles) throw new ForbiddenException();

    const effective = userWithRoles.roles
      .flatMap((r) => r.permissions)
      .map((p) => p.value);

    if (!required.every((p) => effective.includes(p))) {
      throw new ForbiddenException();
    }

    return true;
  }
}
