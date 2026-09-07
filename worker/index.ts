import handler from "vinext/server/app-router-entry";

export default {
  async fetch(request: Request, env: Parameters<typeof handler.fetch>[1], ctx: ExecutionContext): Promise<Response> {
    const response = await handler.fetch(request, env, ctx);
    const path = new URL(request.url).pathname;
    if (path === "/" || path.startsWith("/admin") || path.startsWith("/api/content")) {
      const result = new Response(response.body, response);
      result.headers.set("Cache-Control", "no-store");
      return result;
    }
    return response;
  }
};
