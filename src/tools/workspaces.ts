import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerWorkspaces(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_workspaces_list",
    "List company workspaces.",
    {},
    () => client.workspacesList(),
  );
}
