export function DogWashIllustration() {
  return (
    <div className="hero-art" aria-label="Happy dog peeking out of a self-service wash tub" role="img">
      <span className="art-bubble bubble-a" />
      <span className="art-bubble bubble-b" />
      <span className="art-bubble bubble-c" />
      <span className="art-spark spark-a">✦</span>
      <span className="art-spark spark-b">✦</span>
      <svg viewBox="0 0 620 590" aria-hidden="true">
        <path className="art-arch" d="M78 507V251C78 133 174 37 292 37h39c118 0 214 96 214 214v256" />
        <path className="art-tile" d="M61 507h502" />
        <g className="dog">
          <path className="dog-ear" d="M203 200c-63 2-82 48-56 114 13 32 34 57 67 50l33-77-44-87Z" />
          <path className="dog-ear" d="M414 200c63 2 82 48 56 114-13 32-34 57-67 50l-33-77 44-87Z" />
          <path className="dog-head" d="M220 182c32-40 151-40 183 0 27 35 29 138 7 190-14 34-51 59-99 59s-85-25-99-59c-22-52-20-155 8-190Z" />
          <path className="dog-blaze" d="M310 161c-27 41-25 91-15 132 9 39 5 78-8 115 8 8 16 12 24 12s17-4 25-12c-13-37-17-76-8-115 10-41 12-91-18-132Z" />
          <ellipse className="dog-eye" cx="264" cy="278" rx="12" ry="15" />
          <ellipse className="dog-eye" cx="358" cy="278" rx="12" ry="15" />
          <ellipse className="dog-nose" cx="311" cy="333" rx="28" ry="21" />
          <path className="dog-mouth" d="M311 353c-3 25-29 29-42 13m42-13c3 25 29 29 42 13" />
          <path className="dog-tongue" d="M294 370h34c1 27-7 42-17 42s-18-15-17-42Z" />
        </g>
        <g className="tub">
          <path className="tub-back" d="M132 390h357l-17 54H150l-18-54Z" />
          <path className="tub-front" d="M151 433h322l-28 103H178l-27-103Z" />
          <path className="tub-rim" d="M123 414h376" />
          <circle className="tub-dot" cx="202" cy="480" r="10" />
          <circle className="tub-dot" cx="420" cy="480" r="10" />
          <path className="tub-label" d="M264 471h94v31h-94z" />
          <text x="311" y="493" textAnchor="middle">FRESH</text>
        </g>
      </svg>
      <span className="art-note art-note-top">No mess</span>
      <span className="art-note art-note-bottom">No backache</span>
    </div>
  );
}
