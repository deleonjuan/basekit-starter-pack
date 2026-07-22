import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule, seconds } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { masterDataSourceOptions } from "../database/datasource";
import { TenantMiddleware } from "./tenant/tenant.middleware";
import { ConfigModule } from "@nestjs/config";
import path from "path";

import { TenantModule } from "./tenant/tenant.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { SettingsModule } from "./settings/settings.module";
import config from "../config/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: seconds(config().throttle.ttl),
            limit: config().throttle.limit,
          },
        ],
      }),
    }),
    TypeOrmModule.forRoot(masterDataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
      path: "/api/graphql",
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    TenantModule,
    AuthModule,
    UserModule,
    RoleModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: "/api/graphql", method: RequestMethod.POST });
  }
}
