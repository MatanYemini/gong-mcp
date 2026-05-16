import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerLibrary(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_library_folders",
    "List Gong Library folder structure (id, name, parent).",
    {
      workspaceId: z.string().optional(),
    },
    (args) => client.libraryFolders(args),
  );

  register(
    server,
    "gong_library_folder_content",
    "List calls within a given Library folder.",
    {
      folderId: z.string(),
      cursor: z.string().optional(),
    },
    (args) => client.libraryFolderContent(args),
  );
}
