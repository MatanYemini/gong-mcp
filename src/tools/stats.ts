import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { iso } from "../schemas/common.js";
import { register } from "./helpers.js";

const userIdFilter = {
  fromDateTime: iso.optional(),
  toDateTime: iso.optional(),
  filter: z
    .object({
      userIds: z.array(z.string()).optional(),
      workspaceId: z.string().optional(),
    })
    .partial()
    .optional(),
  cursor: z.string().optional(),
};

export function registerStats(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_stats_activity_aggregate",
    "Aggregated activity metrics (calls, talk time, meeting time, etc.) for selected users across a date range.",
    userIdFilter,
    (args) => client.statsActivityAggregate(args),
  );

  register(
    server,
    "gong_stats_activity_aggregate_by_period",
    "Aggregated activity metrics bucketed by period (e.g. weekly).",
    {
      ...userIdFilter,
      period: z.enum(["DAY", "WEEK", "MONTH"]).optional(),
    },
    (args) => client.statsActivityAggregateByPeriod(args),
  );

  register(
    server,
    "gong_stats_activity_day_by_day",
    "Day-by-day activity breakdown per user.",
    userIdFilter,
    (args) => client.statsActivityDayByDay(args),
  );

  register(
    server,
    "gong_stats_activity_scorecards",
    "Answered scorecards for reviewed users in a date range.",
    {
      fromDateTime: iso.optional(),
      toDateTime: iso.optional(),
      filter: z
        .object({
          reviewedUserIds: z.array(z.string()).optional(),
          reviewerUserIds: z.array(z.string()).optional(),
          scorecardIds: z.array(z.string()).optional(),
        })
        .partial()
        .optional(),
      cursor: z.string().optional(),
    },
    (args) => client.statsActivityScorecards(args),
  );

  register(
    server,
    "gong_stats_interaction",
    "Interaction stats (talk ratio, longest monologue, patience, question rate) for users.",
    userIdFilter,
    (args) => client.statsInteraction(args),
  );
}
