import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import { masterDataSourceOptions } from "../database/datasource";
import { TenantModule } from "./tenant/tenant.module";
import path from "path";

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
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
