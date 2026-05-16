import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerPermissions(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_permission_profiles_list",
    "List all permission profiles in a workspace.",
    { workspaceId: z.string() },
    (args) => client.permissionProfilesList(args),
  );

  register(
    server,
    "gong_permission_profile_get",
    "Get a single permission profile by ID.",
    { profileId: z.string() },
    (args) => client.permissionProfileGet(args),
  );

  register(
    server,
    "gong_permission_profile_create",
    "Create a new permission profile. WRITE.",
    {
      workspaceId: z.string(),
      body: z.record(z.unknown()).describe("Permission profile definition."),
    },
    (args) => client.permissionProfileCreate(args.body, { workspaceId: args.workspaceId }),
  );

  register(
    server,
    "gong_permission_profile_update",
    "Update an existing permission profile. WRITE.",
    {
      profileId: z.string(),
      body: z.record(z.unknown()),
    },
    (args) => client.permissionProfileUpdate(args.body, { profileId: args.profileId }),
  );

  register(
    server,
    "gong_permission_profile_users",
    "List users assigned to a permission profile.",
    { profileId: z.string() },
    (args) => client.permissionProfileUsers(args),
  );
}
