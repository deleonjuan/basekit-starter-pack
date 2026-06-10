/* eslint-disable */
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { TenantGuard } from "../tenant/tenant.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { TenantModule } from "../tenant/tenant.module";
import { UserModule } from "../user/user.module";
import config from "../../config/config";

@Module({
  imports: [
    TenantModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config().jwt.secret,
      signOptions: { expiresIn: config().jwt.expiresIn as any },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthModule {}
