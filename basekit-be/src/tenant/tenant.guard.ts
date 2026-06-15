/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tenant } from "./tenant.entity";
import { IS_PUBLIC_KEY } from "../auth/decorators/public.decorator";
import config from "config/config";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (!config().multitenancy.enabled) return true;

    const req = this.getRequest(ctx);
    const headerSlug: string = req["tenantSlug"];
    const user = req.user;

    if (user?.isSuperAdmin) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // on authenticated routes the JWT tenantId claim must match the header
    if (!isPublic) {
      if (!headerSlug || !user?.tenantId || headerSlug !== user.tenantId) {
        throw new UnauthorizedException("Tenant mismatch");
      }
    }

    // public routes without a tenant header (e.g. health checks) skip tenant lookup
    if (!headerSlug) return true;

    // always verify the tenant exists and is active
    const tenant = await this.tenantRepository.findOneBy({
      slug: headerSlug,
      isActive: true,
    });
    if (!tenant) throw new ForbiddenException("Tenant not found or inactive");

    req["tenant"] = tenant;
    return true;
  }

  private getRequest(ctx: ExecutionContext): any {
    const gqlCtx = GqlExecutionContext.create(ctx);
    return gqlCtx.getContext()?.req ?? ctx.switchToHttp().getRequest();
  }
}
