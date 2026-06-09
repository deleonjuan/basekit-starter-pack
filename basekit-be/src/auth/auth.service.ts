/* eslint-disable */
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { TENANT_DATASOURCE } from "../tenant/tenant.provider";
import { User } from "../user/entities/user.entity";
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
  ) {}

  async login(username: string, password: string): Promise<TokenResult> {
    const user = await this.ds
      .getRepository(User)
      .findOneBy({ username, isActive: true });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return this.buildTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenResult> {
    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: config().jwt.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.ds
      .getRepository(User)
      .findOneBy({ id: decoded.sub, isActive: true });

    if (!user) throw new UnauthorizedException("User not found");

    return this.buildTokens(user);
  }

  private buildTokens(user: User): TokenResult {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      tenantId: user.tenantId,
      isSuperAdmin: user.isSuperAdmin,
    };

    const { secret, expiresIn, refreshSecret, refreshExpiresIn } = config().jwt;

    return {
      accessToken: this.jwtService.sign(payload, {
        secret,
        expiresIn: expiresIn as any,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
      user,
    };
  }
}
