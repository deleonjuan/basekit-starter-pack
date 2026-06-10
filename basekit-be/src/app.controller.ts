import { Controller, Get } from "@nestjs/common";
import { version } from "../package.json";

@Controller()
export class AppController {
  constructor() {}

  @Get("health")
  health(): string {
    return "OK";
  }

  @Get("version")
  version(): string {
    return version;
  }
}
