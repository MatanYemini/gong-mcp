import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { dateWindowQuery } from "../schemas/common.js";
import { register } from "./helpers.js";

export function registerCoaching(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_coaching_get",
    "Retrieve coaching metrics (call reviews, comments, scorecards) for a manager's team in a workspace.",
    {
      workspaceId: z.string(),
      managerUserId: z.string().optional(),
      ...dateWindowQuery,
    },
    (args) => client.coachingGet(args),
  );
}
