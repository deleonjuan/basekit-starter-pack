import { seconds, Throttle as NestThrottle } from "@nestjs/throttler";

export const Throttle = (limit: number, ttlSeconds: number) =>
  NestThrottle({ default: { limit, ttl: seconds(ttlSeconds) } });
