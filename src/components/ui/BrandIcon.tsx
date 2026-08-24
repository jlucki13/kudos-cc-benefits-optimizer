interface BrandIconProps {
  brandKey: string;
  /** Diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Deterministic brand avatar — no logo files, no network requests. The brand
 * key hashes to a hue, so every brand gets a stable, distinct pastel circle
 * with 1-2 uppercase initials.
 */
export function BrandIcon({ brandKey, size = 36, className = '' }: BrandIconProps) {
  const hue = hashString(brandKey) % 360;
  const words = brandKey.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : (words[0] ?? '?').slice(0, 1).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        backgroundColor: `hsl(${hue} 65% 91%)`,
        color: `hsl(${hue} 55% 36%)`,
      }}
    >
      {initials}
    </span>
  );
}

function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash | 0);
}
