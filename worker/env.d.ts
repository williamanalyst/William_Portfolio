interface PortfolioDatabase {
  prepare(sql: string): {
    bind(...values: unknown[]): ReturnType<PortfolioDatabase["prepare"]>;
    first<T>(): Promise<T | null>;
    run(): Promise<{ meta: { changes: number } }>;
  };
}

declare module "cloudflare:workers" {
  export const env: { DB: PortfolioDatabase; CMS_ADMIN_EMAIL?: string };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
