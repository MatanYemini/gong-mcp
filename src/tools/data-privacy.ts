import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerDataPrivacy(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_data_privacy_email_lookup",
    "Find references to an email address across Gong (calls, contacts, etc.).",
    { emailAddress: z.string().email() },
    (args) => client.dataPrivacyEmailLookup(args),
  );

  register(
    server,
    "gong_data_privacy_phone_lookup",
    "Find references to a phone number across Gong.",
    { phoneNumber: z.string() },
    (args) => client.dataPrivacyPhoneLookup(args),
  );

  register(
    server,
    "gong_data_privacy_erase_email",
    "DESTRUCTIVE. Permanently purge all data associated with an email address. Body: { emailAddress: string }.",
    {
      body: z.object({ emailAddress: z.string().email() }),
    },
    (args) => client.dataPrivacyEraseEmail(args.body),
  );

  register(
    server,
    "gong_data_privacy_erase_phone",
    "DESTRUCTIVE. Permanently purge all data associated with a phone number. Body: { phoneNumber: string }.",
    {
      body: z.object({ phoneNumber: z.string() }),
    },
    (args) => client.dataPrivacyErasePhone(args.body),
  );
}
