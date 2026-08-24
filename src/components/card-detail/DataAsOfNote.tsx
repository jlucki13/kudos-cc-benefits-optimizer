interface DataAsOfNoteProps {
  dataAsOf: string;
  sourceUrl: string;
}

/**
 * Benefit terms go stale. Always disclose when the data was last verified and
 * link the source, so the app never presents terms as authoritative.
 */
export function DataAsOfNote({ dataAsOf, sourceUrl }: DataAsOfNoteProps) {
  return (
    <p className="px-5 text-center text-[12px] text-neutral-400">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-neutral-300 underline-offset-2"
      >
        Benefits data as of {dataAsOf}
      </a>
    </p>
  );
}
