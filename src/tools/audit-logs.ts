import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { dateWindowQuery, cursorQuery } from "../schemas/common.js";
import { register } from "./helpers.js";

export function registerAuditLogs(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_logs_list",
    "Retrieve audit logs filtered by logType and date range. Cursor-paginated.",
    {
      logType: z.string().describe("Required log type, e.g. UserLogin, CallAccess, EntityChange."),
      ...dateWindowQuery,
      ...cursorQuery,
    },
    (args) => client.logsList(args),
  );
}
