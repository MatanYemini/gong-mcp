import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerDigitalInteractions(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_digital_interaction_post",
    "Post a digital interaction event (e.g. live chat message, support ticket reply) into Gong. ALPHA. WRITE.",
    {
      body: z.record(z.unknown()).describe("Digital interaction payload per Gong spec."),
    },
    (args) => client.digitalInteractionPost(args.body),
  );
}
