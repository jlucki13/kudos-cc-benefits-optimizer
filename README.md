# Credit Card Benefits Optimizer

Tell it which cards are in your wallet, and it tracks whether you have actually used each
benefit before it resets.

A wallet of premium cards carries a few thousand dollars a year in credits that quietly expire.
A Sapphire Reserve has a $795 annual fee against a $300 travel credit, a $500 hotel credit, and
$300 of dining credit that arrives as **two separate $150 buckets** — miss the first half of the
year and $150 is simply gone. No banking app tells you that.

This is **v1: manual tracking.** You tap to confirm a credit was used. Bank sync is v2.

## Quick start

Requires Node 20.9 or newer. `better-sqlite3` installs a prebuilt binary for common platforms;
it only falls back to compiling when no prebuild matches your Node version.

Each line is a separate command — do not join them with `\`, which is POSIX shell syntax and
will be read as an argument on Windows.

```bash
git clone -b claude/credit-card-benefits-tracker-sa6005 https://github.com/jlucki13/kudos-cc-benefits-optimizer.git
cd kudos-cc-benefits-optimizer
npm install     # postinstall generates the Prisma client
npm run setup   # creates .env, applies migrations, seeds 15 cards
npm run dev     # http://localhost:3000
```

The wallet starts empty on purpose, so you land on the first-run flow. Add a card, open **Cards**
for the detail screen, then **Benefits tracker** to mark credits used.

### Seeing expired benefits

Most of the point of the app is showing credits you have already lost, which needs a date late
enough that some periods have closed. Override the clock rather than waiting for the calendar:

```bash
# macOS / Linux
KUDOS_AS_OF=2026-12-20 npm run dev
```

```powershell
# Windows PowerShell — inline VAR=value does not work here
$env:KUDOS_AS_OF='2026-12-20'; npm run dev
```

```bat
:: Windows cmd.exe
set KUDOS_AS_OF=2026-12-20 && npm run dev
```

The same applies to `DATABASE_URL` and any other variable these docs set inline.

### On Windows

Everything works, with two things to know:

- **Environment variables use a different syntax**, as above. This is the most common way to get
  stuck, because the POSIX form fails with a confusing "not recognized as the name of a cmdlet"
  error rather than saying the variable was the problem.
- **If `npm install` tries to compile `better-sqlite3`** and fails on `node-gyp` or asks for
  Visual Studio Build Tools, no prebuilt binary matched your Node version. Installing build tools
  will fix it, but switching to a Node LTS release (20 or 22) is usually faster and is the
  supported path.

The npm scripts themselves are cross-platform — npm runs them through `cmd.exe` on Windows, and
the setup and test-database helpers are plain Node.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run setup` | `.env` + migrate + seed. Idempotent; safe after a `git pull` |
| `npm test` | Unit tests for the period and ROI math |
| `npm run test:e2e` | Playwright smoke test (own database on port 3100, clock frozen) |
| `npm run db:seed` | Re-seed the catalog. Never touches your wallet or redemptions |
| `npm run db:reset` | Drop and rebuild the database. **Erases your wallet** |

## How the data model works

Two ideas carry most of the weight.

**Benefit values are stored per period, not per year.** The dining credit is `$150` with a
`SEMIANNUAL` cadence, not `$300` annually. That distinction is the whole product: the two halves
are independent buckets, and using one must not affect the other. Storing `$300` would make a
forfeited first half invisible.

**Reset basis is a researched fact, not a default.** Most Amex credits reset on the calendar
year; the Sapphire Reserve travel credit resets on the statement close following your account
anniversary. Chase also migrated cardholders onto that schedule in 2025 while some legacy holders
stayed on calendar year — so reset basis can be **overridden per user card**, not just per
benefit (`UserCardBenefit.resetBasisOverride`).

Periods are derived by a pure function (`src/lib/periods.ts`) from cadence + reset basis + anchor,
and materialized lazily on first use. There is no scheduled job. Period boundaries are civil-date
strings (`'YYYY-MM-DD'`) with an **exclusive end**, which keeps the maths free of timezones.

Money is integer cents throughout. Points valuations are milli-cents per point, so a 10,000-mile
anniversary grant at 1.5¢ resolves to exactly $150 with no floating point.

Benefits come in four kinds. Only the first two are ever converted to dollars:

| Kind | Example | Counted in ROI? |
|---|---|---|
| `STATEMENT_CREDIT` | $300 travel credit | Yes |
| `POINTS_GRANT` | Venture X 10,000 anniversary miles | Yes, at your chosen valuation |
| `SPEND_THRESHOLD` | IHG Diamond after $75,000 spend | No — shown, never priced |
| `PERK` | Lounge access | No |

## About the card data

Every figure is hand-curated. There is no public issuer API for benefit terms, and terms change
often — a card in the original plan (the Bilt Mastercard) turned out to have been discontinued in
February 2026 and had to be replaced mid-build.

Each card records `dataAsOf` and `sourceUrl`, and the app shows the as-of date on the card
screen. **One caveat worth stating plainly:** direct page fetching was blocked in the environment
this catalog was written in, so figures were verified against live web search results rather than
by loading the issuer's page. The `sourceUrl` is the correct canonical page to link to, but it is
a citation, not a fetch receipt. Treat this as a tracker's working copy, not an authority — check
your own statement before making a decision on it.

A few figures are flagged low-confidence in the source files: Amex Gold's APR range (Gold is a
charge card, so a single APR range fits poorly), Citi Strata Premier having no foreign
transaction fee, and Capital One Venture's network, which varies by application source.

Card artwork is generated from CSS gradient specs and inline SVG. No issuer imagery is used.

## What is deliberately not built

- **Bank sync.** v1 is manual. The Plaid button and bank sign-in row render visibly inert rather
  than faking a flow.
- **Card numbers.** The app never asks for one. It tracks benefits and has no use for a PAN.
- **Card-linked offers**, and the `Spend` / `Shop` nav destinations. These are shopping features,
  not benefits tracking, and there is no data source for them. They render disabled rather than
  as empty screens.
- **Reward multipliers valued in dollars.** Without transaction data there is no spend to
  multiply, so `8x` is displayed and not priced.

The **Balance** tab shows a per-card benefits balance sheet rather than an account balance, which
would need sync. This is a deliberate divergence from the app it is modelled on.

## The v2 seam

Plaid support should not require reshaping anything. The schema already carries
`BenefitEntry.source` (`MANUAL` today), a unique `BenefitEntry.externalTxnId` so a future import
deduplicates against manual entries automatically, and `UserCard.plaidItemId` /
`plaidAccountId`. No Plaid code, stub adapters, or unused tables ship in v1 — the seam is those
fields plus the fact that every write goes through `recordRedemption` in
`src/app/actions/benefits.ts`.

## Layout

```
prisma/schema.prisma      database schema
prisma/seed.ts            slug-keyed upserts; never touches user data
src/catalog/              15 cards as typed reference data (source of truth)
src/lib/periods.ts        pure period engine — no Prisma, no date library
src/lib/roi.ts            pure rollups: captured / claimable / forfeited
src/lib/queries.ts        builds view models from the database
src/lib/view-models.ts    the contract between data and UI
src/app/actions/          server actions (add card, record redemption, undo)
tests/unit/               period and ROI maths
tests/e2e/                Playwright smoke test
```

## Postgres

Change `provider` in `prisma/schema.prisma` and swap the adapter in `src/lib/db.ts`. The
connection URL already lives outside the schema, in `prisma.config.ts`.
