import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import path from "path";

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
