import { MiddlewareHandlerContext } from "$fresh/server.ts";

const allowedIps = [
    '127.0.0.1',
    '34.120.54.55',
];

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
    const remoteAddr = ctx.remoteAddr as Deno.NetAddr;
    if (!allowedIps.includes(remoteAddr.hostname)) {
        return;
    }

    ctx.state.data = "OK";
    const resp = await ctx.next();
    resp.headers.set("server", "fresh server");
    return resp;
}