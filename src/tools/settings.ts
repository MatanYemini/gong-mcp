import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerSettings(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_settings_scorecards",
    "List scorecard definitions configured in Gong.",
    { workspaceId: z.string().optional() },
    (args) => client.settingsScorecards(args),
  );

  register(
    server,
    "gong_settings_trackers",
    "List keyword trackers configured in Gong.",
    { workspaceId: z.string().optional() },
    (args) => client.settingsTrackers(args),
  );
}
