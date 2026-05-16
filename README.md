# gong-mcp

[Model Context Protocol](https://modelcontextprotocol.io) server that exposes the full Gong.io public API surface (Public API v2 + Engage API) to LLM clients like Claude Desktop, Claude Code, Cursor, and any other MCP-compatible host.

One MCP tool per Gong endpoint, 58 tools total.

## What's covered

| Category | Tools |
|---|---|
| Calls | list, create, get, add-media, extensive, transcript, manual-CRM-associations, AI content, users-access (get/grant/revoke) |
| Users | list, get, extensive, settings-history |
| Stats | activity aggregate / aggregate-by-period / day-by-day / scorecards, interaction |
| CRM | integrations (list/register/delete), entities (get/upload), entity-schema (get/upload), request-status |
| Library | folders, folder-content |
| Permissions | profiles (list/get/create/update), profile-users |
| Data Privacy | email/phone lookup, email/phone erasure |
| Settings | scorecards, trackers |
| Workspaces | list |
| Meetings (Beta) | create, update, delete, integration-status |
| Engagement (Beta) | content shared/viewed, custom action |
| Digital Interactions (Alpha) | post |
| Audit Logs | list |
| Coaching | get |
| Engage Flows | list, folders, prospects (get/assign/unassign-by-crm-id/unassign-by-instance-id) |

## Tool reference

Every Gong endpoint is exposed as a single MCP tool named `gong_<area>_<action>`. Tools marked **WRITE** mutate state in Gong — the rest are read-only.

### Calls
| Tool | Description |
|---|---|
| `gong_calls_list` | List calls in a date range; returns metadata, cursor-paginated. |
| `gong_calls_create` | **WRITE** Register a call recorded outside Gong. |
| `gong_calls_get` | Get a single call's basic metadata by ID. |
| `gong_calls_add_media` | **WRITE** Attach audio/video to a previously-created call. |
| `gong_calls_extensive` | Detailed call data: parties, content, interaction, trackers, topics, brief, highlights. |
| `gong_calls_transcript` | Sentence-level transcripts with speaker IDs and timestamps. |
| `gong_calls_manual_crm_associations` | List calls manually associated to CRM objects. |
| `gong_calls_ai_content` | AI-generated call brief, key points, action items, summary. |
| `gong_calls_users_access_get` | Which users have access to a set of calls. |
| `gong_calls_users_access_grant` | **WRITE** Grant users access to calls. |
| `gong_calls_users_access_revoke` | **WRITE** Revoke users' access to calls. |

### Users
| Tool | Description |
|---|---|
| `gong_users_list` | List all users in the workspace. |
| `gong_users_get` | Get a single user by ID. |
| `gong_users_extensive` | Detailed user data including managers, custom fields. |
| `gong_users_settings_history` | Historical changes to a user's settings. |

### Stats
| Tool | Description |
|---|---|
| `gong_stats_activity_aggregate` | Aggregate activity metrics (calls, time, etc.) per user. |
| `gong_stats_activity_aggregate_by_period` | Aggregate activity bucketed by period. |
| `gong_stats_activity_day_by_day` | Day-by-day activity breakdown. |
| `gong_stats_activity_scorecards` | Scorecard results per user. |
| `gong_stats_interaction` | Interaction stats (talk ratio, longest monologue, etc.). |

### CRM
| Tool | Description |
|---|---|
| `gong_crm_integrations_list` | List configured CRM integrations. |
| `gong_crm_integrations_register` | **WRITE** Register a new CRM integration. |
| `gong_crm_integrations_delete` | **WRITE** Delete a CRM integration. |
| `gong_crm_entities_get` | Fetch CRM entity records. |
| `gong_crm_entities_upload` | **WRITE** Upload CRM entity records to Gong. |
| `gong_crm_entity_schema_get` | Get the schema for a CRM entity type. |
| `gong_crm_entity_schema_upload` | **WRITE** Upload a CRM entity schema. |
| `gong_crm_request_status` | Check status of a CRM upload request. |

### Library
| Tool | Description |
|---|---|
| `gong_library_folders` | List library folders. |
| `gong_library_folder_content` | List calls inside a library folder. |

### Permissions
| Tool | Description |
|---|---|
| `gong_permission_profiles_list` | List all permission profiles. |
| `gong_permission_profile_get` | Get a single permission profile. |
| `gong_permission_profile_create` | **WRITE** Create a permission profile. |
| `gong_permission_profile_update` | **WRITE** Update a permission profile. |
| `gong_permission_profile_users` | List users assigned to a profile. |

### Data Privacy
| Tool | Description |
|---|---|
| `gong_data_privacy_email_lookup` | Find all data associated with an email. |
| `gong_data_privacy_phone_lookup` | Find all data associated with a phone number. |
| `gong_data_privacy_erase_email` | **WRITE** GDPR erasure by email. |
| `gong_data_privacy_erase_phone` | **WRITE** GDPR erasure by phone. |

### Settings
| Tool | Description |
|---|---|
| `gong_settings_scorecards` | List scorecard definitions. |
| `gong_settings_trackers` | List smart tracker definitions. |

### Workspaces
| Tool | Description |
|---|---|
| `gong_workspaces_list` | List all workspaces. |

### Meetings (Beta)
| Tool | Description |
|---|---|
| `gong_meetings_create` | **WRITE** Create a Gong-scheduled meeting. |
| `gong_meetings_update` | **WRITE** Update a meeting. |
| `gong_meetings_delete` | **WRITE** Delete a meeting. |
| `gong_meetings_integration_status` | Calendar/meeting integration status. |

### Engagement (Beta)
| Tool | Description |
|---|---|
| `gong_engagement_content_shared` | **WRITE** Record content shared with a prospect. |
| `gong_engagement_content_viewed` | **WRITE** Record content viewed by a prospect. |
| `gong_engagement_action` | **WRITE** Record a custom engagement action. |

### Digital Interactions (Alpha)
| Tool | Description |
|---|---|
| `gong_digital_interaction_post` | **WRITE** Post a digital interaction event. |

### Audit Logs
| Tool | Description |
|---|---|
| `gong_logs_list` | List audit-log entries. |

### Coaching
| Tool | Description |
|---|---|
| `gong_coaching_get` | Get coaching stats for a user / period. |

### Engage Flows
| Tool | Description |
|---|---|
| `gong_flows_list` | List Engage flows. |
| `gong_flows_folders_list` | List Engage flow folders. |
| `gong_flows_prospects_get` | List prospects in a flow. |
| `gong_flows_prospects_assign` | **WRITE** Assign prospects to a flow. |
| `gong_flows_prospects_unassign_by_crm_id` | **WRITE** Unassign prospects by CRM ID. |
| `gong_flows_prospects_unassign_by_instance_id` | **WRITE** Unassign prospects by flow-instance ID. |

## Prerequisites

- **Node.js ≥ 18** (`node --version`).
- A **Gong access key + secret**. Generate them in Gong: **Company Settings → Ecosystem → API**. The user who creates the key needs API permission on the workspace.

## 1. Install

```bash
git clone <this-repo> gong-mcp
cd gong-mcp
npm install
```

## 2. Configure credentials

Copy the example env file and fill in your key/secret:

```bash
cp .env.example .env
# then edit .env
```

Or export the variables in your shell:

```bash
export GONG_ACCESS_KEY="your-key"
export GONG_ACCESS_KEY_SECRET="your-secret"
# Only needed if your Gong account lives on the EU pod:
# export GONG_BASE_URL="https://api.eu.gong.io"
```

| Env var | Required | Default |
|---|---|---|
| `GONG_ACCESS_KEY` | yes | — |
| `GONG_ACCESS_KEY_SECRET` | yes | — |
| `GONG_BASE_URL` | no | `https://api.gong.io` (override to `https://api.eu.gong.io` for the EU pod) |

## 3. Build & run

```bash
npm run build          # compiles TypeScript → dist/
node dist/index.js     # starts the MCP server on stdio
```

Or run from source during development (no build step):

```bash
npm run dev            # uses tsx to run src/index.ts directly
```

The server speaks the MCP protocol over **stdio** — it stays quiet on startup and waits for an MCP client to connect. If you see no output, that's normal. If you see `gong-mcp failed to start: ...`, the env vars aren't set correctly.

### HTTP mode (Streamable HTTP)

Pass `--port` to serve MCP over HTTP instead of stdio:

```bash
node dist/index.js --port 8765                 # binds 127.0.0.1:8765/mcp
node dist/index.js --port 8765 --host 0.0.0.0  # bind on all interfaces
PORT=8765 node dist/index.js                   # PORT env var works too
```

The endpoint is `POST/GET/DELETE /mcp` per the [MCP Streamable HTTP spec](https://modelcontextprotocol.io/specification). The server keeps the same Gong rate limiter (3 req/sec) across all sessions.

Once the package is published, you can run it without cloning:

```bash
GONG_ACCESS_KEY=... GONG_ACCESS_KEY_SECRET=... \
  npx -y gong-mcp --port 8765
```

## 4. Connect from an MCP client

You almost never run `gong-mcp` directly — you point an MCP-capable client at it. Pick your client below.

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "gong": {
      "command": "node",
      "args": ["/absolute/path/to/gong-mcp/dist/index.js"],
      "env": {
        "GONG_ACCESS_KEY": "your-key",
        "GONG_ACCESS_KEY_SECRET": "your-secret"
      }
    }
  }
}
```

Restart Claude Desktop. Open a new chat and ask "list my recent Gong calls" — Claude should call `gong_calls_list`.

### Claude Code

```bash
claude mcp add gong \
  -e GONG_ACCESS_KEY=your-key \
  -e GONG_ACCESS_KEY_SECRET=your-secret \
  -- node /absolute/path/to/gong-mcp/dist/index.js
```

Then `/mcp` inside Claude Code to confirm it's connected.

### Cursor

Settings → MCP → add a new server with the same `command` / `args` / `env` shape as the Claude Desktop config above.

### Any other MCP host

It's a vanilla stdio MCP server. Anything that follows the MCP spec works:

```
command: node
args:    ["/absolute/path/to/gong-mcp/dist/index.js"]
env:     GONG_ACCESS_KEY, GONG_ACCESS_KEY_SECRET
```

## Smoke test (without an MCP client)

```bash
npm test
```

Runs unit tests covering the rate limiter, auth header, config validation, and tool registration. Doesn't hit the live Gong API.

To verify auth against a real tenant, the simplest one-liner is:

```bash
curl -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET" https://api.gong.io/v2/workspaces
```

A 200 + JSON means your credentials work. A 401 means the key/secret are wrong; a 403 means the key lacks the right scope.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Missing Gong credentials` on startup | `GONG_ACCESS_KEY` / `GONG_ACCESS_KEY_SECRET` not exported to the process. In Claude Desktop, set them under the `env` key — `.env` files are not auto-loaded. |
| `401 Unauthorized` from any tool | Wrong key/secret, or the key was rotated. |
| `403 Forbidden` from a specific tool | The access key lacks the required scope (e.g. `api:calls:read`). Add the scope in Gong's API settings. |
| All requests slow | Expected: Gong caps you at 3 req/sec. The client queues to stay under the limit. |
| `429` errors despite the limiter | Another process is sharing the same API key. The server only rate-limits its own traffic. |
| EU tenant returns 404 on every call | Set `GONG_BASE_URL=https://api.eu.gong.io`. |

## Rate limits

Gong enforces 3 req/sec and 10,000 req/day per access key. The client uses a 3/sec token bucket and retries `429` / `5xx` responses up to 3 times with `Retry-After` honored.

## Error handling

On a Gong API error the tool returns `isError: true` with a JSON payload `{ status, method, path, body, retryAfterSeconds }` so the model can decide how to retry.

## Testing

```bash
npm test
```

Covers: token bucket throttling, auth header construction, config validation, full tool-set registration.

## License

MIT
