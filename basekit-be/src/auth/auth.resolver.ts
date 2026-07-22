import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthPayload } from "./dto/auth-payload.type";
import { LoginInput } from "./dto/login.input";
import { Public } from "./decorators/public.decorator";
import { Throttle } from "../common/decorators/throttle.decorator";
import config from "../../config/config";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle(config().throttle.loginLimit, config().throttle.loginTtl)
  @Mutation(() => AuthPayload)
  async login(
    @Args("input") input: LoginInput,
    @Context() ctx: { res: Response },
  ): Promise<AuthPayload> {
    const { accessToken, refreshToken, user } = await this.authService.login(
      input.username,
      input.password,
    );
    this.setTokenCookies(ctx.res, accessToken, refreshToken);
    return { user };
  }

  @Public()
  @Mutation(() => AuthPayload)
  async refreshToken(
    @Context() ctx: { req: { cookies: Record<string, string> }; res: Response },
  ): Promise<AuthPayload> {
    const token = ctx.req.cookies?.refresh_token;
    const { accessToken, refreshToken, user } =
      await this.authService.refresh(token);
    this.setTokenCookies(ctx.res, accessToken, refreshToken);
    return { user };
  }

  @Mutation(() => Boolean)
  async logout(
    @Context() ctx: { req: { cookies: Record<string, string> }; res: Response },
  ): Promise<boolean> {
    await this.authService.logout(ctx.req.cookies?.refresh_token);
    ctx.res.clearCookie("access_token");
    ctx.res.clearCookie("refresh_token");
    return true;
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const { cookieMaxAge, refreshCookieMaxAge } = config().jwt;
    const base = { httpOnly: true, sameSite: "strict" as const };

    res.cookie("access_token", accessToken, { ...base, maxAge: cookieMaxAge });
    res.cookie("refresh_token", refreshToken, {
      ...base,
      maxAge: refreshCookieMaxAge,
    });
  }
}
