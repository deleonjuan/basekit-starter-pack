import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./tenant.entity";
import { TenantMiddleware } from "./tenant.middleware";
import { TenantGuard } from "./tenant.guard";
import { tenantDataSourceProvider } from "./tenant.provider";

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantGuard, tenantDataSourceProvider],
  exports: [TenantGuard, tenantDataSourceProvider],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
