export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="Fresh Paws Dog Wash">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-ear brand-ear-left" />
        <span className="brand-ear brand-ear-right" />
        <span className="brand-face">
          <span className="brand-eye brand-eye-left" />
          <span className="brand-eye brand-eye-right" />
          <span className="brand-nose" />
        </span>
        <span className="brand-bubble brand-bubble-one" />
        <span className="brand-bubble brand-bubble-two" />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>Fresh Paws</strong>
          <small>Self-serve dog wash</small>
        </span>
      )}
    </span>
  );
}
