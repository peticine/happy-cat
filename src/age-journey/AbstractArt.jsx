/** Thorne-inspired abstract SVG compositions — one per journey step */

export function AbstractBackdrop() {
  return (
    <div className="aj-art-backdrop" aria-hidden="true">
      <svg className="aj-art-bg-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <circle cx="620" cy="120" r="180" fill="var(--aj-art-fill)" opacity="0.35" />
        <circle cx="80" cy="680" r="220" fill="var(--aj-art-fill)" opacity="0.25" />
        <path
          d="M0 400 Q200 280 400 400 T800 400"
          fill="none"
          stroke="var(--aj-art-stroke)"
          strokeWidth="0.75"
          opacity="0.2"
        />
        <path
          d="M0 520 Q250 620 500 480 T800 560"
          fill="none"
          stroke="var(--aj-art-stroke)"
          strokeWidth="0.5"
          opacity="0.15"
        />
      </svg>
    </div>
  );
}

export function AbstractStepArt({ step }) {
  const arts = [
    /* 0 Meet — cellular orbs */
    <svg key="0" viewBox="0 0 360 140" className="aj-art-step-svg">
      <circle cx="90" cy="70" r="48" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="90" cy="70" r="28" fill="currentColor" opacity="0.06" />
      <circle cx="180" cy="55" r="32" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="180" cy="55" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="270" cy="85" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.18" />
      <line x1="138" y1="70" x2="148" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="212" y1="55" x2="230" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <path d="M40 110 Q180 90 320 110" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
    </svg>,

    /* 1 Age — vertical rhythm */
    <svg key="1" viewBox="0 0 360 140" className="aj-art-step-svg">
      <line x1="180" y1="20" x2="180" y2="120" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="180" cy="40" r="6" fill="currentColor" opacity="0.35" />
      <circle cx="180" cy="70" r="10" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      <circle cx="180" cy="100" r="5" fill="currentColor" opacity="0.2" />
      <path d="M60 70 Q120 40 180 70 T300 70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <ellipse cx="80" cy="70" rx="24" ry="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" transform="rotate(-15 80 70)" />
      <ellipse cx="280" cy="70" rx="24" ry="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" transform="rotate(15 280 70)" />
    </svg>,

    /* 2 Risk — scatter field */
    <svg key="2" viewBox="0 0 360 140" className="aj-art-step-svg">
      {[
        [60, 45, 4],
        [120, 90, 3],
        [180, 50, 5],
        [240, 95, 3],
        [300, 55, 4],
        [90, 110, 2],
        [210, 30, 2],
        [270, 115, 2],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={0.08 + i * 0.02} />
      ))}
      <path
        d="M40 70 L120 70 L180 50 L240 90 L320 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
        strokeDasharray="4 6"
      />
    </svg>,

    /* 3 Results — clinical grid */
    <svg key="3" viewBox="0 0 360 140" className="aj-art-step-svg">
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`v${i}`}
          x1={72 + i * 54}
          y1="24"
          x2={72 + i * 54}
          y2="116"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <line
          key={`h${i}`}
          x1="36"
          y1={40 + i * 38}
          x2="324"
          y2={40 + i * 38}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}
      <rect x="126" y="52" width="108" height="36" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="180" cy="70" r="8" fill="currentColor" opacity="0.12" />
    </svg>,

    /* 4 Consult — single arc embrace */
    <svg key="4" viewBox="0 0 360 140" className="aj-art-step-svg">
      <path
        d="M40 100 Q180 10 320 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.22"
      />
      <path
        d="M70 100 Q180 35 290 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.12"
      />
      <circle cx="180" cy="62" r="18" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="180" cy="62" r="4" fill="currentColor" opacity="0.25" />
    </svg>,
  ];

  return (
    <div className="aj-art-step" aria-hidden="true">
      {arts[step] ?? arts[0]}
    </div>
  );
}
