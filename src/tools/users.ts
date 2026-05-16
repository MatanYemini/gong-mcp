import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { cursorQuery } from "../schemas/common.js";
import { register } from "./helpers.js";

export function registerUsers(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_users_list",
    "List all Gong users in the account. Cursor-paginated.",
    {
      ...cursorQuery,
      includeAvatars: z.boolean().optional(),
    },
    (args) => client.usersList(args),
  );

  register(
    server,
    "gong_users_get",
    "Get a single Gong user by ID.",
    { id: z.string().describe("Gong user ID.") },
    (args) => client.usersGet(args.id),
  );

  register(
    server,
    "gong_users_extensive",
    "Filter users by IDs, email addresses, or active status. Body: { filter: { userIds?: string[], emailAddresses?: string[], includeAvatars?: boolean } }.",
    {
      filter: z
        .object({
          userIds: z.array(z.string()).optional(),
          emailAddresses: z.array(z.string()).optional(),
          includeAvatars: z.boolean().optional(),
        })
        .partial()
        .optional(),
      cursor: z.string().optional(),
    },
    (args) => client.usersExtensive(args),
  );

  register(
    server,
    "gong_users_settings_history",
    "Retrieve the settings change history for a single user.",
    { id: z.string() },
    (args) => client.usersSettingsHistory(args.id),
  );
}
