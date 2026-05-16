import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GongClient } from "./client/gong-client.js";
import { loadConfig } from "./config.js";
import { registerAllTools } from "./tools/index.js";

export function createServer(): { server: McpServer; client: GongClient } {
  const config = loadConfig();
  const client = new GongClient(config);
  const server = new McpServer({
    name: "gong-mcp",
    version: "0.1.0",
  });
  registerAllTools(server, client);
  return { server, client };
}
