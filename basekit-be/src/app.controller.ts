import { Controller, Get } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { version } from "../package.json";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @SkipThrottle()
  @Get("health")
  health(): string {
    return "OK";
  }

  @Public()
  @SkipThrottle()
  @Get("version")
  version(): string {
    return version;
  }
}
