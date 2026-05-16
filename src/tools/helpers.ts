import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";

import { GongApiError } from "../client/errors.js";

/**
 * Wraps a Gong client call in the MCP tool response envelope.
 * On GongApiError, returns isError=true with a structured payload so the LLM can decide how to recover.
 */
export function register<S extends ZodRawShape>(
  server: McpServer,
  name: string,
  description: string,
  schema: S,
  fn: (args: { [K in keyof S]: ReturnType<S[K]["parse"]> }) => Promise<unknown>,
): void {
  const handler = async (args: { [K in keyof S]: ReturnType<S[K]["parse"]> }): Promise<CallToolResult> => {
    try {
      const result = await fn(args);
      const text = result === undefined ? "(empty response)" : JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      const payload =
        err instanceof GongApiError
          ? err.toJSON()
          : { name: (err as Error).name, message: (err as Error).message };
      return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        isError: true,
      };
    }
  };
  // Cast: the SDK overload resolution struggles with our generic, but at runtime
  // the signature is identical to `tool(name, description, paramsSchema, cb)`.
  (server.tool as unknown as (n: string, d: string, s: S, h: typeof handler) => unknown)(
    name,
    description,
    schema,
    handler,
  );
}
