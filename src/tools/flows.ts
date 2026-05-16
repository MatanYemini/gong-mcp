import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { cursorQuery } from "../schemas/common.js";
import { register } from "./helpers.js";

export function registerFlows(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_flows_list",
    "List Gong Engage flows (company, personal, shared). Cursor-paginated.",
    {
      ...cursorQuery,
      ownerUserId: z.string().optional(),
      folderId: z.string().optional(),
    },
    (args) => client.flowsList(args),
  );

  register(
    server,
    "gong_flows_folders_list",
    "List Engage flow folders (company, personal, shared).",
    {
      ownerUserId: z.string().optional(),
    },
    (args) => client.flowsFoldersList(args),
  );

  register(
    server,
    "gong_flows_prospects_get",
    "Get flows assigned to a batch of prospects (up to 100). Body: { crmContactIds?: string[], flowInstanceIds?: string[] }.",
    {
      body: z.record(z.unknown()),
    },
    (args) => client.flowsProspectsGet(args.body),
  );

  register(
    server,
    "gong_flows_prospects_assign",
    "Assign up to 100 prospects to an Engage flow (with optional content overrides). WRITE.",
    {
      body: z.record(z.unknown()).describe("{ flowId, ownerUserId, prospects: [...] , overrides? }"),
    },
    (args) => client.flowsProspectsAssign(args.body),
  );

  register(
    server,
    "gong_flows_prospects_unassign_by_crm_id",
    "Unassign a prospect from a flow using CRM contact ID. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ crmContactId, flowId }"),
    },
    (args) => client.flowsProspectsUnassignByCrmId(args.body),
  );

  register(
    server,
    "gong_flows_prospects_unassign_by_instance_id",
    "Unassign a prospect from a flow using flow instance ID. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ flowInstanceId }"),
    },
    (args) => client.flowsProspectsUnassignByInstanceId(args.body),
  );
}
