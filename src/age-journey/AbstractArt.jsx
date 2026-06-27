/** Minimal clinical line art — one per journey step */

export function AbstractBackdrop() {
  return (
    <div className="aj-art-backdrop" aria-hidden="true">
      <svg className="aj-art-bg-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <circle cx="680" cy="100" r="140" fill="var(--aj-art-fill)" opacity="0.06" />
        <circle cx="100" cy="700" r="180" fill="var(--aj-art-fill)" opacity="0.04" />
      </svg>
    </div>
  );
}

export function AbstractStepArt({ step }) {
  const arts = [
    <svg key="0" viewBox="0 0 360 72" className="aj-art-step-svg">
      <line x1="40" y1="36" x2="320" y2="36" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="120" cy="36" r="8" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <circle cx="240" cy="36" r="5" fill="currentColor" opacity="0.15" />
    </svg>,
    <svg key="1" viewBox="0 0 360 72" className="aj-art-step-svg">
      <line x1="180" y1="12" x2="180" y2="60" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="180" cy="24" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="180" cy="48" r="4" fill="currentColor" opacity="0.15" />
    </svg>,
    <svg key="2" viewBox="0 0 360 72" className="aj-art-step-svg">
      {[80, 140, 200, 260].map((x) => (
        <circle key={x} cx={x} cy="36" r="4" fill="currentColor" opacity="0.12" />
      ))}
      <path d="M60 36 H300" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 5" />
    </svg>,
    <svg key="3" viewBox="0 0 360 72" className="aj-art-step-svg">
      <rect x="130" y="22" width="100" height="28" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <line x1="150" y1="36" x2="210" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    </svg>,
    <svg key="4" viewBox="0 0 360 72" className="aj-art-step-svg">
      <path d="M80 48 Q180 18 280 48" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="180" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
    </svg>,
  ];

  return (
    <div className="aj-art-step" aria-hidden="true">
      {arts[step] ?? arts[0]}
    </div>
  );
}
