import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerEngagement(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_engagement_content_shared",
    "Report a content-share event (e.g. proposal sent to prospect). BETA. WRITE.",
    {
      body: z.record(z.unknown()).describe("Engagement share event payload."),
    },
    (args) => client.engagementContentShared(args.body),
  );

  register(
    server,
    "gong_engagement_content_viewed",
    "Report a content-view event. BETA. WRITE.",
    {
      body: z.record(z.unknown()),
    },
    (args) => client.engagementContentViewed(args.body),
  );

  register(
    server,
    "gong_engagement_action",
    "Report a custom engagement action. BETA. WRITE.",
    {
      body: z.record(z.unknown()),
    },
    (args) => client.engagementAction(args.body),
  );
}
