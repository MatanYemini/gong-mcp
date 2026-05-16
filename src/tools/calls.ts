import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { callFilter, contentSelector, cursorQuery, dateWindowQuery } from "../schemas/common.js";
import { register } from "./helpers.js";

export function registerCalls(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_calls_list",
    "List calls within a date range. Returns metadata (id, title, started, duration, participants). Cursor-paginated via `records.cursor`.",
    {
      ...dateWindowQuery,
      ...cursorQuery,
      workspaceId: z.string().optional(),
      callIds: z.array(z.string()).optional().describe("Filter to specific call IDs."),
    },
    (args) => client.callsList(args),
  );

  register(
    server,
    "gong_calls_create",
    "Register a new call (typically a call recorded outside Gong). Returns the new call ID. See Gong docs for the required `clientUniqueId`, `parties`, `direction`, etc. body.",
    {
      body: z
        .record(z.unknown())
        .describe("Gong call creation payload. Must include clientUniqueId, parties, direction, primaryUser, actualStart."),
    },
    (args) => client.callsCreate(args.body),
  );

  register(
    server,
    "gong_calls_get",
    "Get a single call's basic metadata by Gong call ID.",
    { id: z.string().describe("Gong call ID.") },
    (args) => client.callsGet(args.id),
  );

  register(
    server,
    "gong_calls_add_media",
    "Attach media (audio or video) to a previously-created call. Body specifies a downloadable URL Gong will fetch.",
    {
      id: z.string().describe("Gong call ID."),
      body: z.record(z.unknown()).describe("Media payload — usually { mediaUrl: string }."),
    },
    (args) => client.callsAddMedia(args.id, args.body),
  );

  register(
    server,
    "gong_calls_extensive",
    "Detailed call data (parties, content, interaction, trackers, topics, brief, highlights). Filter+contentSelector body.",
    {
      filter: callFilter.optional(),
      contentSelector: contentSelector.optional(),
      cursor: z.string().optional(),
    },
    (args) => client.callsExtensive(args),
  );

  register(
    server,
    "gong_calls_transcript",
    "Retrieve transcripts for calls matched by filter. Returns sentence-level transcripts with speaker IDs and timestamps. Cursor-paginated.",
    {
      filter: callFilter.optional(),
      cursor: z.string().optional(),
    },
    (args) => client.callsTranscript(args),
  );

  register(
    server,
    "gong_calls_manual_crm_associations",
    "List calls that have been manually associated to CRM objects (opportunities, accounts, etc).",
    {
      ...dateWindowQuery,
      ...cursorQuery,
      workspaceId: z.string().optional(),
    },
    (args) => client.callsManualCrmAssociations(args),
  );

  register(
    server,
    "gong_calls_ai_content",
    "AI-generated content for calls (call brief, key points, action items, AI summary).",
    {
      ...dateWindowQuery,
      ...cursorQuery,
      callIds: z.array(z.string()).optional(),
      workspaceId: z.string().optional(),
    },
    (args) => client.callsAiContent(args),
  );

  register(
    server,
    "gong_calls_users_access_get",
    "Return which users have access to a given set of calls. Body: { callsIds: string[], userIds?: string[] }.",
    {
      body: z.record(z.unknown()).describe("{ callsIds: string[], userIds?: string[] }"),
    },
    (args) => client.callsUsersAccessGet(args.body),
  );

  register(
    server,
    "gong_calls_users_access_grant",
    "Grant specified users access to specified calls. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ callsIds: string[], userIds: string[] }"),
    },
    (args) => client.callsUsersAccessGrant(args.body),
  );

  register(
    server,
    "gong_calls_users_access_revoke",
    "Revoke specified users' access to specified calls. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ callsIds: string[], userIds: string[] }"),
    },
    (args) => client.callsUsersAccessRevoke(args.body),
  );
}
