import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { registerAuditLogs } from "./audit-logs.js";
import { registerCalls } from "./calls.js";
import { registerCoaching } from "./coaching.js";
import { registerCrm } from "./crm.js";
import { registerDataPrivacy } from "./data-privacy.js";
import { registerDigitalInteractions } from "./digital-interactions.js";
import { registerEngagement } from "./engagement.js";
import { registerFlows } from "./flows.js";
import { registerLibrary } from "./library.js";
import { registerMeetings } from "./meetings.js";
import { registerPermissions } from "./permissions.js";
import { registerSettings } from "./settings.js";
import { registerStats } from "./stats.js";
import { registerUsers } from "./users.js";
import { registerWorkspaces } from "./workspaces.js";

export function registerAllTools(server: McpServer, client: GongClient): void {
  registerCalls(server, client);
  registerUsers(server, client);
  registerStats(server, client);
  registerCrm(server, client);
  registerLibrary(server, client);
  registerPermissions(server, client);
  registerDataPrivacy(server, client);
  registerSettings(server, client);
  registerWorkspaces(server, client);
  registerMeetings(server, client);
  registerEngagement(server, client);
  registerDigitalInteractions(server, client);
  registerAuditLogs(server, client);
  registerCoaching(server, client);
  registerFlows(server, client);
}
