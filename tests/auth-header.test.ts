import { describe, expect, it } from "vitest";

import { GongClient } from "../src/client/gong-client.js";

describe("GongClient auth header", () => {
  it("produces Basic base64(key:secret)", () => {
    const client = new GongClient({
      accessKey: "myKey",
      accessKeySecret: "mySecret",
      baseUrl: "https://api.gong.io",
    });
    // Use bracket access so the test is resilient to private-field renaming.
    const header = (client as unknown as { authHeader: string }).authHeader;
    const expected = "Basic " + Buffer.from("myKey:mySecret").toString("base64");
    expect(header).toBe(expected);
  });
});
