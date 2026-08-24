/**
 * as-of.ts — the single source of "today".
 *
 * Everything date-dependent (queries, actions, period materialization) calls
 * `asOfDate()` instead of `new Date()` so the whole app can be frozen to a
 * fixed civil date with `KUDOS_AS_OF=YYYY-MM-DD` — deterministic tests and
 * Playwright screenshots that don't rot as real time passes.
 */
import { parseCivil, type CivilDate } from '@/lib/civil';

/** Today as a civil date: `KUDOS_AS_OF` when set (validated), else the real UTC date. */
export function asOfDate(): CivilDate {
  const override = process.env.KUDOS_AS_OF;
  if (override) {
    parseCivil(override); // throws on anything malformed — fail loudly, not with silent drift
    return override;
  }
  // The one sanctioned `new Date()`: real wall-clock today, pinned to UTC.
  return new Date().toISOString().slice(0, 10);
}
