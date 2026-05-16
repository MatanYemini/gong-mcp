import { request as undiciRequest, Agent } from "undici";

import type { GongConfig } from "../config.js";
import { GongApiError, isRetryableStatus, type GongApiErrorBody } from "./errors.js";
import { RateLimiter } from "./rate-limiter.js";

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

interface RequestOptions {
  query?: Record<string, unknown> | undefined;
  body?: Json | undefined;
  pathParams?: Record<string, string | number> | undefined;
}

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 3;

export class GongClient {
  private readonly authHeader: string;
  private readonly baseUrl: string;
  private readonly limiter = new RateLimiter({ ratePerSecond: 3 });
  private readonly dispatcher = new Agent({ keepAliveTimeout: 30_000, keepAliveMaxTimeout: 60_000 });

  constructor(config: GongConfig) {
    this.authHeader =
      "Basic " + Buffer.from(`${config.accessKey}:${config.accessKeySecret}`).toString("base64");
    this.baseUrl = config.baseUrl;
  }

  // ---------- internal ----------

  private buildPath(template: string, pathParams?: Record<string, string | number>): string {
    if (!pathParams) return template;
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      const v = pathParams[key];
      if (v === undefined) throw new Error(`Missing path param '${key}' for ${template}`);
      return encodeURIComponent(String(v));
    });
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) {
          for (const item of v) url.searchParams.append(k, String(item));
        } else {
          url.searchParams.append(k, String(v));
        }
      }
    }
    return url.toString();
  }

  async request<T = unknown>(method: string, pathTemplate: string, opts: RequestOptions = {}): Promise<T> {
    const path = this.buildPath(pathTemplate, opts.pathParams);
    const url = this.buildUrl(path, opts.query);
    const headers: Record<string, string> = {
      Authorization: this.authHeader,
      Accept: "application/json",
    };
    let payload: Buffer | undefined;
    if (opts.body !== undefined) {
      payload = Buffer.from(JSON.stringify(opts.body));
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = String(payload.byteLength);
    }

    let attempt = 0;
    while (true) {
      await this.limiter.acquire();
      const res = await undiciRequest(url, {
        method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        headers,
        body: payload,
        bodyTimeout: DEFAULT_TIMEOUT_MS,
        headersTimeout: DEFAULT_TIMEOUT_MS,
        dispatcher: this.dispatcher,
      });

      const status = res.statusCode;

      if (status >= 200 && status < 300) {
        const text = await res.body.text();
        if (!text) return undefined as T;
        try {
          return JSON.parse(text) as T;
        } catch {
          return text as unknown as T;
        }
      }

      const retryAfterHeader = res.headers["retry-after"];
      const retryAfter =
        typeof retryAfterHeader === "string" && retryAfterHeader.length > 0
          ? Number(retryAfterHeader)
          : undefined;

      const bodyText = await res.body.text();
      let bodyParsed: GongApiErrorBody | string | undefined;
      if (bodyText) {
        try {
          bodyParsed = JSON.parse(bodyText) as GongApiErrorBody;
        } catch {
          bodyParsed = bodyText;
        }
      }

      if (isRetryableStatus(status) && attempt < MAX_RETRIES) {
        const waitMs =
          (retryAfter && Number.isFinite(retryAfter) ? retryAfter : Math.min(2 ** attempt, 8)) * 1000;
        await new Promise((r) => setTimeout(r, waitMs));
        attempt += 1;
        continue;
      }

      throw new GongApiError({
        status,
        method,
        path,
        body: bodyParsed,
        retryAfterSeconds: retryAfter,
      });
    }
  }

  // ---------- Calls ----------
  callsList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/calls", { query });
  }
  callsCreate(body: Json) {
    return this.request("POST", "/v2/calls", { body });
  }
  callsGet(id: string) {
    return this.request("GET", "/v2/calls/{id}", { pathParams: { id } });
  }
  callsAddMedia(id: string, body: Json) {
    return this.request("PUT", "/v2/calls/{id}/media", { pathParams: { id }, body });
  }
  callsExtensive(body: Json) {
    return this.request("POST", "/v2/calls/extensive", { body });
  }
  callsTranscript(body: Json) {
    return this.request("POST", "/v2/calls/transcript", { body });
  }
  callsManualCrmAssociations(query: Record<string, unknown>) {
    return this.request("GET", "/v2/calls/manual-crm-associations", { query });
  }
  callsAiContent(query: Record<string, unknown>) {
    return this.request("GET", "/v2/calls/ai-content", { query });
  }
  callsUsersAccessGet(body: Json) {
    return this.request("POST", "/v2/calls/users-access", { body });
  }
  callsUsersAccessGrant(body: Json) {
    return this.request("PUT", "/v2/calls/users-access", { body });
  }
  callsUsersAccessRevoke(body: Json) {
    return this.request("DELETE", "/v2/calls/users-access", { body });
  }

  // ---------- Users ----------
  usersList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/users", { query });
  }
  usersGet(id: string) {
    return this.request("GET", "/v2/users/{id}", { pathParams: { id } });
  }
  usersExtensive(body: Json) {
    return this.request("POST", "/v2/users/extensive", { body });
  }
  usersSettingsHistory(id: string) {
    return this.request("GET", "/v2/users/{id}/settings-history", { pathParams: { id } });
  }

  // ---------- Stats ----------
  statsActivityAggregate(body: Json) {
    return this.request("POST", "/v2/stats/activity/aggregate", { body });
  }
  statsActivityAggregateByPeriod(body: Json) {
    return this.request("POST", "/v2/stats/activity/aggregate-by-period", { body });
  }
  statsActivityDayByDay(body: Json) {
    return this.request("POST", "/v2/stats/activity/day-by-day", { body });
  }
  statsActivityScorecards(body: Json) {
    return this.request("POST", "/v2/stats/activity/scorecards", { body });
  }
  statsInteraction(body: Json) {
    return this.request("POST", "/v2/stats/interaction", { body });
  }

  // ---------- CRM ----------
  crmIntegrationsList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/crm/integrations", { query });
  }
  crmIntegrationsRegister(body: Json) {
    return this.request("PUT", "/v2/crm/integrations", { body });
  }
  crmIntegrationsDelete(query: Record<string, unknown>) {
    return this.request("DELETE", "/v2/crm/integrations", { query });
  }
  crmEntitiesGet(query: Record<string, unknown>) {
    return this.request("GET", "/v2/crm/entities", { query });
  }
  crmEntitiesUpload(body: Json) {
    return this.request("POST", "/v2/crm/entities", { body });
  }
  crmEntitySchemaGet(query: Record<string, unknown>) {
    return this.request("GET", "/v2/crm/entity-schema", { query });
  }
  crmEntitySchemaUpload(body: Json) {
    return this.request("POST", "/v2/crm/entity-schema", { body });
  }
  crmRequestStatus(query: Record<string, unknown>) {
    return this.request("GET", "/v2/crm/request-status", { query });
  }

  // ---------- Library ----------
  libraryFolders(query: Record<string, unknown>) {
    return this.request("GET", "/v2/library/folders", { query });
  }
  libraryFolderContent(query: Record<string, unknown>) {
    return this.request("GET", "/v2/library/folder-content", { query });
  }

  // ---------- Permissions ----------
  permissionProfilesList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/all-permission-profiles", { query });
  }
  permissionProfileGet(query: Record<string, unknown>) {
    return this.request("GET", "/v2/permission-profile", { query });
  }
  permissionProfileCreate(body: Json, query?: Record<string, unknown>) {
    return this.request("POST", "/v2/permission-profile", { body, query });
  }
  permissionProfileUpdate(body: Json, query?: Record<string, unknown>) {
    return this.request("PUT", "/v2/permission-profile", { body, query });
  }
  permissionProfileUsers(query: Record<string, unknown>) {
    return this.request("GET", "/v2/permission-profile/users", { query });
  }

  // ---------- Data Privacy ----------
  dataPrivacyEmailLookup(query: Record<string, unknown>) {
    return this.request("GET", "/v2/data-privacy/data-for-email-address", { query });
  }
  dataPrivacyPhoneLookup(query: Record<string, unknown>) {
    return this.request("GET", "/v2/data-privacy/data-for-phone-number", { query });
  }
  dataPrivacyEraseEmail(body: Json) {
    return this.request("POST", "/v2/data-privacy/erase-data-for-email-address", { body });
  }
  dataPrivacyErasePhone(body: Json) {
    return this.request("POST", "/v2/data-privacy/erase-data-for-phone-number", { body });
  }

  // ---------- Settings ----------
  settingsScorecards(query: Record<string, unknown>) {
    return this.request("GET", "/v2/settings/scorecards", { query });
  }
  settingsTrackers(query: Record<string, unknown>) {
    return this.request("GET", "/v2/settings/trackers", { query });
  }

  // ---------- Workspaces ----------
  workspacesList() {
    return this.request("GET", "/v2/workspaces");
  }

  // ---------- Meetings (Beta) ----------
  meetingsCreate(body: Json) {
    return this.request("POST", "/v2/meetings", { body });
  }
  meetingsUpdate(meetingId: string, body: Json) {
    return this.request("PUT", "/v2/meetings/{meetingId}", { pathParams: { meetingId }, body });
  }
  meetingsDelete(meetingId: string, body?: Json) {
    return this.request("DELETE", "/v2/meetings/{meetingId}", { pathParams: { meetingId }, body });
  }
  meetingsIntegrationStatus(body: Json) {
    return this.request("POST", "/v2/meetings/integration/status", { body });
  }

  // ---------- Engagement (Beta) ----------
  engagementContentShared(body: Json) {
    return this.request("PUT", "/v2/customer-engagement/content/shared", { body });
  }
  engagementContentViewed(body: Json) {
    return this.request("PUT", "/v2/customer-engagement/content/viewed", { body });
  }
  engagementAction(body: Json) {
    return this.request("PUT", "/v2/customer-engagement/action", { body });
  }

  // ---------- Digital Interactions ----------
  digitalInteractionPost(body: Json) {
    return this.request("POST", "/v2/digital-interaction", { body });
  }

  // ---------- Audit Logs ----------
  logsList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/logs", { query });
  }

  // ---------- Coaching ----------
  coachingGet(query: Record<string, unknown>) {
    return this.request("GET", "/v2/coaching", { query });
  }

  // ---------- Engage Flows ----------
  flowsList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/flows", { query });
  }
  flowsFoldersList(query: Record<string, unknown>) {
    return this.request("GET", "/v2/flows/folders", { query });
  }
  flowsProspectsGet(body: Json) {
    return this.request("POST", "/v2/flows/prospects", { body });
  }
  flowsProspectsAssign(body: Json) {
    return this.request("POST", "/v2/flows/prospects/assign", { body });
  }
  flowsProspectsUnassignByCrmId(body: Json) {
    return this.request("POST", "/v2/flows/prospects/unassign-flows-by-crm-id", { body });
  }
  flowsProspectsUnassignByInstanceId(body: Json) {
    return this.request("POST", "/v2/flows/prospects/unassign-flows-by-instance-id", { body });
  }
}
