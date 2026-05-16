import { z } from "zod";

/** ISO 8601 datetime, e.g. "2024-05-01T00:00:00Z". */
export const iso = z.string().describe("ISO 8601 datetime, e.g. 2024-05-01T00:00:00Z");

/** Inclusive `fromDateTime` / exclusive `toDateTime` window used across Gong endpoints. */
export const dateWindowQuery = {
  fromDateTime: iso.optional().describe("Inclusive start of the window."),
  toDateTime: iso.optional().describe("Exclusive end of the window."),
};

/** Cursor used for forward pagination. */
export const cursorQuery = {
  cursor: z
    .string()
    .optional()
    .describe("Pagination cursor returned in the previous response's `records.cursor`."),
};

/** Generic content-selector body fragment for /v2/calls/extensive and /v2/calls/transcript. */
export const contentSelector = z
  .object({
    context: z.enum(["None", "Extended"]).optional(),
    exposedFields: z
      .object({
        parties: z.boolean().optional(),
        content: z
          .object({
            structure: z.boolean().optional(),
            topics: z.boolean().optional(),
            trackers: z.boolean().optional(),
            trackerOccurrences: z.boolean().optional(),
            pointsOfInterest: z.boolean().optional(),
            brief: z.boolean().optional(),
            outline: z.boolean().optional(),
            highlights: z.boolean().optional(),
            callOutcome: z.boolean().optional(),
            keyPoints: z.boolean().optional(),
          })
          .partial()
          .optional(),
        interaction: z
          .object({
            speakers: z.boolean().optional(),
            video: z.boolean().optional(),
            personInteractionStats: z.boolean().optional(),
            questions: z.boolean().optional(),
          })
          .partial()
          .optional(),
        collaboration: z.object({ publicComments: z.boolean().optional() }).partial().optional(),
        media: z.boolean().optional(),
      })
      .partial()
      .optional(),
  })
  .partial();

/** Filter fragment used by extensive/transcript bodies. */
export const callFilter = z
  .object({
    fromDateTime: iso.optional(),
    toDateTime: iso.optional(),
    workspaceId: z.string().optional(),
    callIds: z.array(z.string()).optional(),
    primaryUserIds: z.array(z.string()).optional(),
  })
  .partial();
