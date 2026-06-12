import { Controller, Get } from "@nestjs/common";
import { version } from "../package.json";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get("health")
  health(): string {
    return "OK";
  }

  @Public()
  @Get("version")
  version(): string {
    return version;
  }
}
