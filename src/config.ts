export interface GongConfig {
  accessKey: string;
  accessKeySecret: string;
  baseUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GongConfig {
  const accessKey = env.GONG_ACCESS_KEY?.trim();
  const accessKeySecret = env.GONG_ACCESS_KEY_SECRET?.trim();

  if (!accessKey || !accessKeySecret) {
    throw new Error(
      "Missing Gong credentials. Set GONG_ACCESS_KEY and GONG_ACCESS_KEY_SECRET environment variables. " +
        "Generate them in Gong → Company Settings → Ecosystem → API.",
    );
  }

  const baseUrl = (env.GONG_BASE_URL?.trim() || "https://api.gong.io").replace(/\/+$/, "");

  return { accessKey, accessKeySecret, baseUrl };
}
