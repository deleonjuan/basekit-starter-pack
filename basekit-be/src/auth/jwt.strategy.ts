/* eslint-disable */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import config from "../../config/config";

export interface JwtPayload {
  sub: string;
  username: string;
  tenantId: string | null;
  isSuperAdmin: boolean;
  jti?: string; // present only on refresh tokens
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config().jwt.secret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
