import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request } from "express";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: unknown, next: NextFunction) {
    const slug = req.headers["x-tenant"] as string;
    if (!slug) throw new BadRequestException("Missing x-tenant header");
    req["tenantSlug"] = slug;
    next();
  }
}
