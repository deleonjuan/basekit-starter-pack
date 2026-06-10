/* eslint-disable */
import {
  ForbiddenException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { DataSource } from "typeorm";
import { TENANT_DATASOURCE } from "../tenant/tenant.provider";
import { TenantService } from "../tenant/tenant.service";
import { User } from "../user/entities/user.entity";
import { RefreshToken } from "./entities/refresh-token.entity";
import { JwtPayload } from "./jwt.strategy";
import config from "../../config/config";

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(TENANT_DATASOURCE) private readonly ds: DataSource,
    private readonly jwtService: JwtService,
    private readonly tenantService: TenantService,
  ) {}

  async login(username: string, password: string): Promise<TokenResult> {
    const user = await this.ds
      .getRepository(User)
      .findOneBy({ username, isActive: true });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    let tenantSlug: string | null = null;
    if (!user.isSuperAdmin && user.tenantId) {
      const tenant = await this.tenantService.findById(user.tenantId);
      if (!tenant) throw new ForbiddenException("Tenant is inactive");
      tenantSlug = tenant.slug;
    }

    return this.buildTokens(user, tenantSlug);
  }

  async refresh(refreshToken: string | undefined): Promise<TokenResult> {
    if (!refreshToken) throw new UnauthorizedException("Invalid refresh token");
    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: config().jwt.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (!decoded.jti) throw new UnauthorizedException("Invalid refresh token");

    const repo = this.ds.getRepository(RefreshToken);
    const stored = await repo.findOneBy({ id: decoded.jti });
    if (!stored) throw new UnauthorizedException("Refresh token revoked");

    const valid = await bcrypt.compare(refreshToken, stored.tokenHash);
    if (!valid) throw new UnauthorizedException("Refresh token invalid");

    await repo.delete(stored.id);

    const user = await this.ds
      .getRepository(User)
      .findOneBy({ id: decoded.sub, isActive: true });

    if (!user) throw new UnauthorizedException("User not found");

    // decoded.tenantId is already a slug (set correctly at login time)
    return this.buildTokens(user, decoded.tenantId);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    // decode without verifying — we only need the jti to delete the row.
    // verify() would throw on expired tokens and silently skip the DB cleanup.
    const decoded = this.jwtService.decode(refreshToken) as JwtPayload | null;
    if (decoded?.jti) {
      await this.ds.getRepository(RefreshToken).delete({ id: decoded.jti });
    }
  }

  private async buildTokens(
    user: User,
    tenantSlug: string | null,
  ): Promise<TokenResult> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      tenantId: tenantSlug, // slug, not the UUID FK from user.tenantId
      isSuperAdmin: user.isSuperAdmin,
    };

    const {
      secret,
      expiresIn,
      refreshSecret,
      refreshExpiresIn,
      refreshCookieMaxAge,
    } = config().jwt;

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as any,
    });

    const jti = randomUUID();
    const refreshToken = this.jwtService.sign(
      { ...payload, jti },
      { secret: refreshSecret, expiresIn: refreshExpiresIn as any },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + refreshCookieMaxAge);

    const repo = this.ds.getRepository(RefreshToken);
    await repo.save(
      repo.create({ id: jti, userId: user.id, tokenHash, expiresAt }),
    );

    return { accessToken, refreshToken, user };
  }
}
