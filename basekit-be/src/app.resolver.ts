import { Query, Resolver } from "@nestjs/graphql";
import { Public } from "./auth/decorators/public.decorator";

@Resolver()
export class AppResolver {
  @Public()
  @Query(() => String)
  health(): string {
    return "ok";
  }
}
