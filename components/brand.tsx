import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="Fresh Paws Dog Wash">
      <span className="brand-mark">
        <Image
          src="/images/fresh-paws-logo-1.png"
          alt=""
          width={1082}
          height={1080}
          className="brand-logo"
          priority
        />
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
