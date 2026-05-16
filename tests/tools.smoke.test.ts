import { describe, expect, it, beforeAll } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GongClient } from "../src/client/gong-client.js";
import { registerAllTools } from "../src/tools/index.js";

const EXPECTED_TOOLS = [
  // Calls
  "gong_calls_list",
  "gong_calls_create",
  "gong_calls_get",
  "gong_calls_add_media",
  "gong_calls_extensive",
  "gong_calls_transcript",
  "gong_calls_manual_crm_associations",
  "gong_calls_ai_content",
  "gong_calls_users_access_get",
  "gong_calls_users_access_grant",
  "gong_calls_users_access_revoke",
  // Users
  "gong_users_list",
  "gong_users_get",
  "gong_users_extensive",
  "gong_users_settings_history",
  // Stats
  "gong_stats_activity_aggregate",
  "gong_stats_activity_aggregate_by_period",
  "gong_stats_activity_day_by_day",
  "gong_stats_activity_scorecards",
  "gong_stats_interaction",
  // CRM
  "gong_crm_integrations_list",
  "gong_crm_integrations_register",
  "gong_crm_integrations_delete",
  "gong_crm_entities_get",
  "gong_crm_entities_upload",
  "gong_crm_entity_schema_get",
  "gong_crm_entity_schema_upload",
  "gong_crm_request_status",
  // Library
  "gong_library_folders",
  "gong_library_folder_content",
  // Permissions
  "gong_permission_profiles_list",
  "gong_permission_profile_get",
  "gong_permission_profile_create",
  "gong_permission_profile_update",
  "gong_permission_profile_users",
  // Data Privacy
  "gong_data_privacy_email_lookup",
  "gong_data_privacy_phone_lookup",
  "gong_data_privacy_erase_email",
  "gong_data_privacy_erase_phone",
  // Settings
  "gong_settings_scorecards",
  "gong_settings_trackers",
  // Workspaces
  "gong_workspaces_list",
  // Meetings
  "gong_meetings_create",
  "gong_meetings_update",
  "gong_meetings_delete",
  "gong_meetings_integration_status",
  // Engagement
  "gong_engagement_content_shared",
  "gong_engagement_content_viewed",
  "gong_engagement_action",
  // Digital Interactions
  "gong_digital_interaction_post",
  // Audit Logs
  "gong_logs_list",
  // Coaching
  "gong_coaching_get",
  // Flows
  "gong_flows_list",
  "gong_flows_folders_list",
  "gong_flows_prospects_get",
  "gong_flows_prospects_assign",
  "gong_flows_prospects_unassign_by_crm_id",
  "gong_flows_prospects_unassign_by_instance_id",
];

describe("tool registration", () => {
  let server: McpServer;

  beforeAll(() => {
    const client = new GongClient({
      accessKey: "k",
      accessKeySecret: "s",
      baseUrl: "https://api.gong.io",
    });
    server = new McpServer({ name: "gong-mcp-test", version: "0.0.0" });
    registerAllTools(server, client);
  });

  it("registers exactly the expected tool set", () => {
    // McpServer keeps tools on the underlying server's request handler registry.
    // The SDK exposes `_registeredTools` (Map) on the McpServer instance.
    const registered = (server as unknown as { _registeredTools: Record<string, unknown> })
      ._registeredTools;
    const names = Object.keys(registered);
    for (const expected of EXPECTED_TOOLS) {
      expect(names, `expected tool ${expected}`).toContain(expected);
    }
    expect(names.length).toBe(EXPECTED_TOOLS.length);
  });
});
