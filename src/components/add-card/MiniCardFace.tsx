import type { CardArtSpec } from '@/catalog/types';

/**
 * Tiny gradient card face for catalog rows. Deliberately local: the real
 * CardArt component belongs to W3 — swap in later if the coordinator dedupes.
 */
export default function MiniCardFace({ art }: { art: CardArtSpec }) {
  return (
    <div
      className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-black/10"
      style={{ background: `linear-gradient(135deg, ${art.gradient.join(', ')})` }}
      aria-hidden
    >
      <div
        className="absolute top-1.5 left-1.5 h-1.5 w-2.5 rounded-[2px] opacity-90"
        style={{ background: art.chipColor }}
      />
      <div className="absolute -top-4 -right-2 h-10 w-10 rounded-full bg-white/10" />
    </div>
  );
}
