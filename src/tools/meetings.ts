import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerMeetings(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_meetings_create",
    "Create a new Gong meeting (calendar invite + recording). BETA. WRITE.",
    {
      body: z.record(z.unknown()).describe("Meeting payload: { startTime, endTime, invitees:[...], title, ... }"),
    },
    (args) => client.meetingsCreate(args.body),
  );

  register(
    server,
    "gong_meetings_update",
    "Update an existing Gong meeting. BETA. WRITE.",
    {
      meetingId: z.string(),
      body: z.record(z.unknown()),
    },
    (args) => client.meetingsUpdate(args.meetingId, args.body),
  );

  register(
    server,
    "gong_meetings_delete",
    "Delete a Gong meeting. BETA. WRITE.",
    {
      meetingId: z.string(),
      body: z.record(z.unknown()).optional(),
    },
    (args) => client.meetingsDelete(args.meetingId, args.body),
  );

  register(
    server,
    "gong_meetings_integration_status",
    "Validate that the calendar/meeting integration for a given user is functional. BETA.",
    {
      body: z.record(z.unknown()).describe("{ userId: string } or similar."),
    },
    (args) => client.meetingsIntegrationStatus(args.body),
  );
}
