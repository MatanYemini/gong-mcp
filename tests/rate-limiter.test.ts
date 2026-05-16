import { describe, expect, it } from "vitest";

import { RateLimiter } from "../src/client/rate-limiter.js";

describe("RateLimiter", () => {
  it("allows burst up to capacity immediately", async () => {
    const limiter = new RateLimiter({ ratePerSecond: 3 });
    const start = Date.now();
    await Promise.all([limiter.acquire(), limiter.acquire(), limiter.acquire()]);
    expect(Date.now() - start).toBeLessThan(100);
  });

  it("throttles the 6th call to ~1s with 3/sec budget", async () => {
    const limiter = new RateLimiter({ ratePerSecond: 3 });
    const start = Date.now();
    await Promise.all(
      Array.from({ length: 6 }, () => limiter.acquire()),
    );
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(900);
    expect(elapsed).toBeLessThan(2000);
  });
});
