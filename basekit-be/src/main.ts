/* eslint-disable */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "../config/config";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const { port } = config().server;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-tenant"],
  });

  await app.listen(port);
  const url = await app.getUrl();
  console.log(`App running at ${url}`);
}
bootstrap();
