import type { CardArtSpec } from '@/catalog/types';
import { CardPattern } from '@/components/card-art/patterns';

type Network = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';

interface CardArtProps {
  spec: CardArtSpec;
  name: string;
  network: Network;
  size: 'hero' | 'thumb';
  className?: string;
}

/**
 * A generative credit-card face at the ISO/IEC 7810 ID-1 aspect ratio.
 * CSS gradients + inline SVG only — no image files, no external requests, and
 * nothing that reproduces an issuer's trademarked artwork. At `thumb` size
 * only the base, pattern, and chip survive; text is dropped.
 */
export function CardArt({ spec, name, network, size, className = '' }: CardArtProps) {
  const hero = size === 'hero';
  const gradient = `linear-gradient(135deg, ${spec.gradient.join(', ')})`;
  return (
    <div
      role="img"
      aria-label={`${name} card art`}
      className={`relative aspect-[1.586] overflow-hidden ${
        hero
          ? 'w-full rounded-xl shadow-[0_10px_26px_rgba(15,23,42,0.28)]'
          : 'w-16 rounded-[5px] shadow-[0_1px_4px_rgba(15,23,42,0.3)]'
      } ${className}`}
      style={{ background: gradient }}
    >
      <CardPattern pattern={spec.pattern} color={spec.textColor} />
      <ChipGlyph
        color={spec.chipColor}
        className={hero ? 'absolute left-[7%] top-[30%] w-[14%]' : 'absolute left-[8%] top-[32%] w-[17%]'}
      />
      {hero ? (
        <>
          <ContactlessGlyph color={spec.textColor} className="absolute left-[23.5%] top-[28.5%] w-[7.5%]" />
          <span
            className="absolute bottom-[8.5%] left-[7%] right-[32%] truncate text-[15px] font-semibold tracking-wide"
            style={{ color: spec.textColor }}
          >
            {name}
          </span>
          <span
            className="absolute bottom-[9.5%] right-[7%] text-[12px] font-extrabold uppercase tracking-[0.16em] opacity-90"
            style={{ color: spec.textColor }}
          >
            {network}
          </span>
        </>
      ) : null}
      {/* hairline inner ring for a hint of physical edge */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

/** EMV chip: rounded rect with a gold gradient and three hairline contacts. */
function ChipGlyph({ color, className }: { color: string; className?: string }) {
  const id = `card-chip-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 36 27" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={mix(color, '#FFFFFF', 0.45)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={mix(color, '#000000', 0.28)} />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="35" height="26" rx="5" fill={`url(#${id})`} stroke="rgba(0,0,0,0.25)" strokeWidth="0.75" />
      <g stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" fill="none">
        <path d="M0.5 9h35" />
        <path d="M0.5 18h35" />
        <path d="M18 9v9" />
      </g>
    </svg>
  );
}

/** Contactless indicator: three nested arcs. */
function ContactlessGlyph({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeOpacity="0.85"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <path d="M7 9.2a7.4 7.4 0 0 1 0 5.6" />
      <path d="M10.6 7a11.8 11.8 0 0 1 0 10" />
      <path d="M14.2 4.8a16.4 16.4 0 0 1 0 14.4" />
    </svg>
  );
}

function mix(hex: string, withHex: string, amount: number): string {
  const a = parseHex(hex);
  const b = parseHex(withHex);
  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * amount);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(full, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
