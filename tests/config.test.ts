import { describe, expect, it } from "vitest";

import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("throws when access key missing", () => {
    expect(() => loadConfig({ GONG_ACCESS_KEY_SECRET: "s" } as NodeJS.ProcessEnv)).toThrow(
      /Missing Gong credentials/,
    );
  });

  it("throws when secret missing", () => {
    expect(() => loadConfig({ GONG_ACCESS_KEY: "k" } as NodeJS.ProcessEnv)).toThrow(
      /Missing Gong credentials/,
    );
  });

  it("defaults baseUrl to https://api.gong.io", () => {
    const cfg = loadConfig({
      GONG_ACCESS_KEY: "k",
      GONG_ACCESS_KEY_SECRET: "s",
    } as NodeJS.ProcessEnv);
    expect(cfg.baseUrl).toBe("https://api.gong.io");
  });

  it("strips trailing slashes from baseUrl", () => {
    const cfg = loadConfig({
      GONG_ACCESS_KEY: "k",
      GONG_ACCESS_KEY_SECRET: "s",
      GONG_BASE_URL: "https://api.eu.gong.io//",
    } as NodeJS.ProcessEnv);
    expect(cfg.baseUrl).toBe("https://api.eu.gong.io");
  });
});
