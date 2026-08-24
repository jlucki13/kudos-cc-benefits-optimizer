import type { CardArtSpec } from '@/catalog/types';

interface PatternProps {
  pattern: CardArtSpec['pattern'];
  /** Ink for the pattern — the card's text color, applied at low alpha. */
  color: string;
}

/**
 * Low-opacity generative SVG overlays that evoke premium card finishes.
 * Purely abstract geometry — nothing here reproduces any issuer's artwork.
 * The viewBox matches the ID-1 aspect ratio (397:250 ~ 1.586).
 */
export function CardPattern({ pattern, color }: PatternProps) {
  if (pattern === 'plain') return null;
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 397 250"
      preserveAspectRatio="xMidYMid slice"
    >
      {pattern === 'guilloche' ? <Guilloche color={color} /> : null}
      {pattern === 'sheen' ? <Sheen color={color} /> : null}
      {pattern === 'dots' ? <Dots color={color} /> : null}
    </svg>
  );
}

/** Concentric arc families, offset like engraved banknote work. */
function Guilloche({ color }: { color: string }) {
  const upperRight = Array.from({ length: 13 }, (_, i) => 42 + i * 24);
  const lowerLeft = Array.from({ length: 13 }, (_, i) => 34 + i * 24);
  const weave = Array.from({ length: 9 }, (_, i) => 58 + i * 34);
  return (
    <g fill="none" stroke={color}>
      <g strokeOpacity={0.1} strokeWidth={0.8}>
        {upperRight.map((r) => (
          <circle key={`u${r}`} cx={452} cy={-34} r={r} />
        ))}
      </g>
      <g strokeOpacity={0.09} strokeWidth={0.8}>
        {lowerLeft.map((r) => (
          <circle key={`l${r}`} cx={-44} cy={288} r={r} />
        ))}
      </g>
      <g strokeOpacity={0.05} strokeWidth={0.7}>
        {weave.map((r) => (
          <circle key={`w${r}`} cx={214} cy={332} r={r} />
        ))}
      </g>
    </g>
  );
}

/** Diagonal partial-alpha bands — a brushed-metal sheen. */
function Sheen({ color }: { color: string }) {
  const id = `card-sheen-${sanitize(color)}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.14" stopColor={color} stopOpacity="0" />
          <stop offset="0.4" stopColor={color} stopOpacity="0.14" />
          <stop offset="0.52" stopColor={color} stopOpacity="0.03" />
          <stop offset="0.66" stopColor={color} stopOpacity="0.1" />
          <stop offset="0.9" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="397" height="250" fill={`url(#${id})`} />
    </>
  );
}

/** Subtle dot grid. */
function Dots({ color }: { color: string }) {
  const id = `card-dots-${sanitize(color)}`;
  return (
    <>
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.3" fill={color} fillOpacity="0.14" />
        </pattern>
      </defs>
      <rect width="397" height="250" fill={`url(#${id})`} />
    </>
  );
}

/** Deterministic id fragment so SSR and client markup always agree. */
function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}
