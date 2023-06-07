import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
    const hfAccessToken = req.headers.get('x-hfaccesstoken');

    ctx.state.data = ""

    if (hfAccessToken && hfAccessToken !== "") {
        ctx.state.data = hfAccessToken;
    }

    const resp = await ctx.next();
    resp.headers.set("server", "fresh server");
    return resp;
}