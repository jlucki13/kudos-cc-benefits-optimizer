/** Tinted monogram circle for a benefit's brand. Deterministic color from the seed. */
const PALETTE: [string, string][] = [
  ['#efecfd', '#6c5ce7'],
  ['#e3f0fd', '#1e6fd8'],
  ['#e5f6ec', '#1c9e5f'],
  ['#fdf1e0', '#b45309'],
  ['#fce8f3', '#c0266e'],
  ['#e0f2f1', '#00796b'],
];

function monogram(label: string): string {
  const words = label
    .split(/[\s-_]+/)
    .map((w) => w.trim())
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function BrandCircle({ seed }: { seed: string }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const [bg, fg] = PALETTE[hash % PALETTE.length];
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      {monogram(seed)}
    </div>
  );
}
