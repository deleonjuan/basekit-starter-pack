import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { masterDataSourceOptions } from "../database/datasource";
import { TenantMiddleware } from "./tenant/tenant.middleware";
import path from "path";

import { TenantModule } from "./tenant/tenant.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
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
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: "health", method: RequestMethod.GET })
      .forRoutes({ path: "api/graphql", method: RequestMethod.POST });
  }
}
