#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { createServer as createHttpServer } from "node:http";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { createServer } from "./server.js";

interface CliOptions {
  port: number | undefined;
  host: string;
}

function parseArgs(argv: string[]): CliOptions {
  let port: number | undefined;
  let host = "127.0.0.1";

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    const eq = arg.indexOf("=");
    const [key, inline] = eq === -1 ? [arg, undefined] : [arg.slice(0, eq), arg.slice(eq + 1)];
    const take = (): string => {
      if (inline !== undefined) return inline;
      const next = argv[i + 1];
      if (next === undefined) throw new Error(`Missing value for ${key}`);
      i++;
      return next;
    };

    switch (key) {
      case "--port":
      case "-p": {
        const raw = take();
        const n = Number(raw);
        if (!Number.isInteger(n) || n < 1 || n > 65535) {
          throw new Error(`Invalid --port value '${raw}' (expected integer 1-65535)`);
        }
        port = n;
        break;
      }
      case "--host":
        host = take();
        break;
      case "--help":
      case "-h":
        process.stdout.write(
          "gong-mcp [--port <n>] [--host <addr>]\n" +
            "  default: speaks MCP over stdio\n" +
            "  --port:  speaks MCP over Streamable HTTP on the given port at /mcp\n" +
            "  --host:  bind address for HTTP mode (default 127.0.0.1)\n",
        );
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  const envPort = process.env.PORT?.trim();
  if (port === undefined && envPort) {
    const n = Number(envPort);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      throw new Error(`Invalid PORT env value '${envPort}'`);
    }
    port = n;
  }

  return { port, host };
}

async function runStdio(): Promise<void> {
  const { server } = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function runHttp(port: number, host: string): Promise<void> {
  const { server } = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  await server.connect(transport);

  const httpServer = createHttpServer((req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end();
      return;
    }
    const path = req.url.split("?")[0];
    if (path !== "/mcp") {
      res.statusCode = 404;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "not found", hint: "POST/GET/DELETE /mcp" }));
      return;
    }
    transport.handleRequest(req, res).catch((err) => {
      console.error("gong-mcp request error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end();
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, host, () => {
      httpServer.off("error", reject);
      resolve();
    });
  });
  console.error(`gong-mcp listening on http://${host}:${port}/mcp`);

  const shutdown = (): void => {
    httpServer.close(() => {
      void transport.close().finally(() => process.exit(0));
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.port === undefined) {
    await runStdio();
  } else {
    await runHttp(opts.port, opts.host);
  }
}

main().catch((err) => {
  console.error("gong-mcp failed to start:", err);
  process.exit(1);
});
