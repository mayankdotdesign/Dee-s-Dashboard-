import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Lazy on purpose: creating the client eagerly at module scope broke the
// Vercel build — Next evaluates the root layout's module graph (which
// imports this file) while collecting page data for routes like
// /_not-found, and DATABASE_URL isn't guaranteed available in that build
// phase. Deferring the neon() call to first actual query keeps import-time
// side effects out of it entirely.
let cached: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "No database connection string was provided. Set DATABASE_URL.",
      );
    }
    cached = neon(url);
  }
  return cached;
}

export const sql: NeonQueryFunction<false, false> = ((
  strings: TemplateStringsArray,
  ...values: unknown[]
) => getClient()(strings, ...values)) as NeonQueryFunction<false, false>;
