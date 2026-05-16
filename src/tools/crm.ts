import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { GongClient } from "../client/gong-client.js";
import { register } from "./helpers.js";

export function registerCrm(server: McpServer, client: GongClient): void {
  register(
    server,
    "gong_crm_integrations_list",
    "List Generic CRM integrations registered with this Gong workspace.",
    { integrationType: z.string().optional() },
    (args) => client.crmIntegrationsList(args),
  );

  register(
    server,
    "gong_crm_integrations_register",
    "Register a new Generic CRM integration. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ integrationType, ownerEmail, ... } per Gong CRM API."),
    },
    (args) => client.crmIntegrationsRegister(args.body),
  );

  register(
    server,
    "gong_crm_integrations_delete",
    "Delete a Generic CRM integration. WRITE.",
    { integrationId: z.string() },
    (args) => client.crmIntegrationsDelete(args),
  );

  register(
    server,
    "gong_crm_entities_get",
    "Get CRM objects previously uploaded to Gong.",
    {
      integrationId: z.string(),
      objectType: z.string(),
      objectIds: z.array(z.string()).optional(),
      cursor: z.string().optional(),
    },
    (args) => client.crmEntitiesGet(args),
  );

  register(
    server,
    "gong_crm_entities_upload",
    "Upload CRM objects/entities to Gong. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ integrationId, objectType, objects: Array<{...}> }"),
    },
    (args) => client.crmEntitiesUpload(args.body),
  );

  register(
    server,
    "gong_crm_entity_schema_get",
    "List CRM schema field definitions for an object type.",
    {
      integrationId: z.string(),
      objectType: z.string(),
    },
    (args) => client.crmEntitySchemaGet(args),
  );

  register(
    server,
    "gong_crm_entity_schema_upload",
    "Upload/update CRM schema field definitions. WRITE.",
    {
      body: z.record(z.unknown()).describe("{ integrationId, objectType, fields: [...] }"),
    },
    (args) => client.crmEntitySchemaUpload(args.body),
  );

  register(
    server,
    "gong_crm_request_status",
    "Poll the status of a previously submitted async CRM upload request.",
    { requestId: z.string() },
    (args) => client.crmRequestStatus(args),
  );
}
