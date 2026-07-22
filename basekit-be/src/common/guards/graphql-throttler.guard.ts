/* eslint-disable */
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { GraphQLError } from "graphql";

@Injectable()
export class GraphqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    if (gqlCtx?.req && gqlCtx?.res) return { req: gqlCtx.req, res: gqlCtx.res };

    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const tenant = req["tenant"];
    return tenant ? `${tenant.id}:${req.ip}` : req.ip;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const message = await this.getErrorMessage(context, throttlerLimitDetail);
    throw new GraphQLError(message, {
      extensions: {
        code: "TOO_MANY_REQUESTS",
        retryAfter: throttlerLimitDetail.timeToBlockExpire,
      },
    });
  }
}
