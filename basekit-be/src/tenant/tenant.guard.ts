/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tenant } from "./tenant.entity";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(ctx);
    const headerSlug: string = req["tenantSlug"];
    const user = req.user;

    if (user?.isSuperAdmin) return true;

    const jwtTenantId: string = user?.tenantId;

    if (!jwtTenantId || headerSlug !== jwtTenantId) {
      throw new UnauthorizedException("Tenant mismatch");
    }

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
