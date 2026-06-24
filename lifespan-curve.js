/* Feline vitality curve — single-canvas interactive lifespan data viz */
(function () {
  "use strict";

  // ─── Geometry ───
  const VB_W = 1000;
  const VB_H = 480;
  const M = { l: 64, r: 28, t: 36, b: 64 };
  const PLOT_W = VB_W - M.l - M.r;
  const PLOT_H = VB_H - M.t - M.b;
  const AGE_MAX = 18;

  const xScale = (age) => M.l + (age / AGE_MAX) * PLOT_W;
  const yScale = (v) => M.t + (1 - v / 100) * PLOT_H;

  // ─── Data: organ reserve (%) across lifespan ───
  // Shared early life, diverging after the prime window.
  const MANAGED = [
    { a: 0, v: 55 }, { a: 1, v: 86 }, { a: 2, v: 96 }, { a: 3, v: 100 },
    { a: 5, v: 99 }, { a: 6, v: 98 }, { a: 7, v: 95 }, { a: 9, v: 90 },
    { a: 11, v: 83 }, { a: 13, v: 75 }, { a: 15, v: 66 }, { a: 17, v: 58 }, { a: 18, v: 54 },
  ];
  const UNMANAGED = [
    { a: 0, v: 55 }, { a: 1, v: 86 }, { a: 2, v: 96 }, { a: 3, v: 100 },
    { a: 5, v: 98 }, { a: 6, v: 95 }, { a: 7, v: 88 }, { a: 9, v: 73 },
    { a: 11, v: 57 }, { a: 13, v: 41 }, { a: 15, v: 27 }, { a: 17, v: 15 }, { a: 18, v: 11 },
  ];

  const STAGES = [
    {
      id: "young", label: "Kitten · Young", range: [0, 2], mid: 1,
      title: "Building the system",
      biology:
        "Bone, immune and behavioural systems are still under construction — what you set now becomes the ceiling for lifelong health.",
      drivers: [
        { dir: "lift", habit: "Baseline labs at 6–12 months", why: "creates the personal reference range that makes any future change detectable." },
        { dir: "lift", habit: "Wet / high-moisture food", why: "trains higher water intake early, so urine stays dilute and kidneys work less hard for life." },
        { dir: "drop", habit: "Free-fed dry kibble", why: "drives early weight gain, setting up insulin resistance and chronic urinary strain." },
      ],
      metrics: [
        ["Growth plates", "Open <18 mo"],
        ["Metabolic rate", "2–3× adult"],
        ["Core vaccines", "By 16 wk"],
      ],
    },
    {
      id: "prime", label: "Prime", range: [3, 6], mid: 4.5,
      title: "Peak reserve, silent drift",
      biology:
        "Organ reserve peaks here — but glomerular filtration has already begun a silent ~6–10%/yr decline that habits either slow or speed.",
      drivers: [
        { dir: "lift", habit: "Annual SDMA bloodwork", why: "catches that silent filtration drop 6–12 months before creatinine ever moves." },
        { dir: "lift", habit: "Constant water (fountains, wet food)", why: "lower urine concentration means less daily wear on each nephron." },
        { dir: "drop", habit: "Untreated dental disease", why: "mouth bacteria seed the bloodstream, fuelling low-grade kidney and heart inflammation." },
        { dir: "drop", habit: "Carrying extra weight", why: "fat tissue is metabolically active — it raises insulin resistance and inflammatory load on every organ." },
      ],
      metrics: [
        ["GFR", "~100%"],
        ["SDMA", "<14 µmol/L"],
        ["Systolic BP", "<140 mmHg"],
      ],
    },
    {
      id: "mature", label: "Mature", range: [7, 10], mid: 8.5,
      title: "Reserve spends faster",
      biology:
        "Cats can't regrow nephrons — once lost they're gone, and creatinine stays normal until ~75% of function is already spent.",
      drivers: [
        { dir: "lift", habit: "Twice-yearly screening", why: "finds Stage 1–2 CKD while diet and hydration can still change the slope." },
        { dir: "lift", habit: "Phosphorus-aware diet", why: "less dietary phosphate means less mineral damage to the nephrons that remain." },
        { dir: "drop", habit: "Dry-only feeding", why: "chronic mild dehydration forces kidneys to run at maximum concentration every single day." },
        { dir: "drop", habit: "Skipping vet visits", why: "each missed year is reserve lost invisibly — nothing warns you until it's far along." },
      ],
      metrics: [
        ["Early CKD", "30–40% of cats"],
        ["SDMA >14", "= IRIS Stage 1"],
        ["Thyroid risk", "10–20%"],
      ],
    },
    {
      id: "senior", label: "Senior", range: [11, 14], mid: 12.5,
      title: "Compensation runs out",
      biology:
        "The kidney can no longer concentrate urine or balance minerals, so small daily choices now have outsized effects.",
      drivers: [
        { dir: "lift", habit: "Renal diet + phosphate binders", why: "directly slow the mineral-bone cascade that otherwise accelerates decline." },
        { dir: "lift", habit: "Blood-pressure checks", why: "untreated hypertension shreds the kidney's tiny filtering vessels from the inside." },
        { dir: "drop", habit: "Untreated hyperthyroidism", why: "it inflates filtration and masks kidney disease — until both crash together." },
        { dir: "drop", habit: "Low water intake", why: "a failing kidney can't conserve water, so dehydration compounds damage fast." },
      ],
      metrics: [
        ["CKD prevalence", "50–80%"],
        ["Stage 2 survival", "~1,110 days"],
        ["Phosphorus", "<0.4% diet"],
      ],
    },
    {
      id: "geriatric", label: "Geriatric", range: [15, 18], mid: 16.5,
      title: "Comfort is the metric",
      biology:
        "Reserve is largely spent, so the goal shifts from slowing decline to protecting comfort, appetite and hydration.",
      drivers: [
        { dir: "lift", habit: "Weekly weight & appetite log", why: "early nausea and weight loss are treatable — if you catch the trend, not the crisis." },
        { dir: "lift", habit: "Anti-nausea + fluid support", why: "keeping a cat eating and hydrated protects both comfort and remaining function." },
        { dir: "drop", habit: "Guessing instead of measuring", why: "uremic decline is invisible day-to-day; tracking is the only way to see it coming." },
      ],
      metrics: [
        ["Function left", "<25% (Stage 4)"],
        ["Assessment", "HHHHHMM scale"],
        ["Goal", "Comfort"],
      ],
    },
  ];

  // Estimated good years you can still protect, by where the cat is now.
  function gainForAge(age) {
    if (age == null) return { num: "+2–3 years", sub: "of good, comfortable life with proactive care" };
    if (age < 7) return { num: "+3 years", sub: "of healthy life you can still protect — starting now" };
    if (age < 11) return { num: "+2–3 years", sub: "of good life if you catch changes early" };
    if (age < 15) return { num: "+1–2 years", sub: "of comfort with active management" };
    return { num: "+months", sub: "of added comfort with attentive, measured care" };
  }

  function renderGain() {
    const g = gainForAge(catAge);
    return `
      <div class="curve-gain" id="curve-gain">
        <span class="curve-gain-eyebrow">Proactive care can add</span>
        <span class="curve-gain-num">${g.num}</span>
        <span class="curve-gain-sub">${g.sub}</span>
      </div>`;
  }

  function stageForAge(age) {
    if (age == null) return null;
    for (const s of STAGES) if (age >= s.range[0] && age <= s.range[1]) return s.id;
    return age > 18 ? "geriatric" : null;
  }

  // Linear interpolation of value at a given age
  function valueAt(age, pts) {
    if (age <= pts[0].a) return pts[0].v;
    if (age >= pts[pts.length - 1].a) return pts[pts.length - 1].v;
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      if (age >= p.a && age <= q.a) {
        const t = (age - p.a) / (q.a - p.a);
        return p.v + t * (q.v - p.v);
      }
    }
    return pts[pts.length - 1].v;
  }

  // Catmull-Rom → cubic bezier smoothing
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  const toPx = (pts) => pts.map((p) => ({ x: xScale(p.a), y: yScale(p.v) }));

  let selectedStage = null;
  let catAge = null;
  let catName = null;

  function buildSVG() {
    const managedPx = toPx(MANAGED);
    const unmanagedPx = toPx(UNMANAGED);

    const managedPath = smooth(managedPx);
    const unmanagedPath = smooth(unmanagedPx);

    // Healthspan area: managed top → unmanaged reversed bottom
    const revUnmanaged = smooth([...unmanagedPx].reverse()).replace(/^M/, "L");
    const areaPath = `${managedPath} ${revUnmanaged} Z`;

    // Gridlines + y labels
    let grid = "";
    [0, 25, 50, 75, 100].forEach((v) => {
      const y = yScale(v);
      grid += `<line class="curve-grid" x1="${M.l}" y1="${y.toFixed(1)}" x2="${VB_W - M.r}" y2="${y.toFixed(1)}" />`;
      grid += `<text class="curve-axis-label" x="${M.l - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end">${v}</text>`;
    });

    // Stage zones (clickable) + x labels + dividers
    let zones = "";
    STAGES.forEach((s, i) => {
      const x0 = xScale(s.range[0] === 0 ? 0 : s.range[0] - 0.5);
      const x1 = xScale(i === STAGES.length - 1 ? AGE_MAX : s.range[1] + 0.5);
      const w = x1 - x0;
      const lx = xScale(s.mid);
      zones += `<g class="curve-zone" data-stage="${s.id}" role="button" tabindex="0" aria-label="${s.label}">
        <rect class="curve-zone-hit" x="${x0.toFixed(1)}" y="${M.t}" width="${w.toFixed(1)}" height="${PLOT_H}" />
        <rect class="curve-zone-band" x="${x0.toFixed(1)}" y="${M.t}" width="${w.toFixed(1)}" height="${PLOT_H}" />
        <text class="curve-zone-label" x="${lx.toFixed(1)}" y="${VB_H - M.b + 26}" text-anchor="middle">${s.label.replace(" · ", " ")}</text>
        <text class="curve-zone-age" x="${lx.toFixed(1)}" y="${VB_H - M.b + 44}" text-anchor="middle">${s.range[0]}${i === STAGES.length - 1 ? "+" : "–" + s.range[1]} yrs</text>
      </g>`;
    });

    // Stage anchor dots on the managed curve
    let dots = "";
    STAGES.forEach((s) => {
      const x = xScale(s.mid);
      const y = yScale(valueAt(s.mid, MANAGED));
      dots += `<circle class="curve-stage-dot" data-stage="${s.id}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" />`;
    });

    const svg = `
      <svg class="curve-svg" viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Organ reserve across a cat's lifespan, with and without proactive care">
        <text class="curve-y-title" x="${16}" y="${M.t + PLOT_H / 2}" transform="rotate(-90 16 ${M.t + PLOT_H / 2})" text-anchor="middle">Organ reserve (%)</text>
        ${grid}
        ${zones}
        <path class="curve-area" d="${areaPath}" />
        <path class="curve-line curve-line--unmanaged" d="${unmanagedPath}" />
        <path class="curve-line curve-line--managed" d="${managedPath}" />
        ${dots}
        <g class="curve-here" id="curve-here" style="display:none">
          <line class="curve-here-line" x1="0" y1="${M.t}" x2="0" y2="${M.t + PLOT_H}" />
          <circle class="curve-here-dot" cx="0" cy="0" r="7" />
          <text class="curve-here-label" x="0" y="${M.t - 12}" text-anchor="middle">Your cat</text>
        </g>
      </svg>`;

    return svg;
  }

  function renderDetail(stageId) {
    const s = STAGES.find((x) => x.id === stageId) || STAGES[1];
    const ageLabel = `${s.range[0]}${s.id === "geriatric" ? "+" : "–" + s.range[1]} yrs`;

    const drivers = s.drivers
      .map(
        (d) => `
        <li class="curve-driver curve-driver--${d.dir}">
          <span class="curve-driver-dir" aria-hidden="true">${d.dir === "lift" ? "↑" : "↓"}</span>
          <span class="curve-driver-text"><strong>${d.habit}</strong> — ${d.why}</span>
        </li>`
      )
      .join("");

    const metrics = s.metrics
      .map(
        ([k, v]) =>
          `<div class="curve-metric"><span class="curve-metric-k">${k}</span><span class="curve-metric-v">${v}</span></div>`
      )
      .join("");

    return `
      <div class="curve-detail-inner" data-stage="${s.id}">
        <p class="curve-detail-eyebrow">${s.label} · ${ageLabel}</p>
        <h3 class="curve-detail-title">${s.title}</h3>
        <p class="curve-detail-bio">${s.biology}</p>
        <div class="curve-drivers">
          <p class="curve-drivers-head">What bends the curve here</p>
          <ul class="curve-driver-list">${drivers}</ul>
        </div>
        <div class="curve-metrics" aria-label="Key numbers">${metrics}</div>
      </div>`;
  }

  function selectStage(stageId, svgRoot, detailRoot) {
    selectedStage = stageId;

    svgRoot.querySelectorAll(".curve-zone").forEach((z) => {
      z.classList.toggle("is-selected", z.dataset.stage === stageId);
    });
    svgRoot.querySelectorAll(".curve-stage-dot").forEach((d) => {
      d.classList.toggle("is-selected", d.dataset.stage === stageId);
    });

    detailRoot.innerHTML = renderDetail(stageId);
    const inner = detailRoot.querySelector(".curve-detail-inner");
    if (inner) {
      inner.style.animation = "none";
      void inner.offsetWidth;
      inner.style.animation = "";
    }
  }

  function updateHere(svgRoot) {
    const here = svgRoot.querySelector("#curve-here");
    if (!here) return;
    if (catAge == null) {
      here.style.display = "none";
      return;
    }
    const age = Math.min(catAge, AGE_MAX);
    const x = xScale(age);
    const y = yScale(valueAt(age, MANAGED));
    here.style.display = "";
    here.querySelector(".curve-here-line").setAttribute("x1", x.toFixed(1));
    here.querySelector(".curve-here-line").setAttribute("x2", x.toFixed(1));
    const dot = here.querySelector(".curve-here-dot");
    dot.setAttribute("cx", x.toFixed(1));
    dot.setAttribute("cy", y.toFixed(1));
    const label = here.querySelector(".curve-here-label");
    label.setAttribute("x", x.toFixed(1));
    label.setAttribute("y", (y - 16).toFixed(1));
    label.textContent = catName && catName !== "Your cat" ? catName : "Your cat";
  }

  function animateIn(svgRoot) {
    // Draw the managed line (solid) via dash-offset.
    const managed = svgRoot.querySelector(".curve-line--managed");
    if (managed) {
      const len = managed.getTotalLength();
      managed.style.strokeDasharray = len;
      managed.style.strokeDashoffset = len;
      requestAnimationFrame(() => {
        managed.style.transition = "stroke-dashoffset 1100ms cubic-bezier(0.16,1,0.3,1)";
        managed.style.strokeDashoffset = "0";
      });
    }
    // Fade in the dashed unmanaged line, area, and dots (preserves CSS dash pattern).
    ["curve-line--unmanaged", "curve-area"].forEach((cls) => {
      const el = svgRoot.querySelector("." + cls);
      if (!el) return;
      el.style.opacity = "0";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 900ms ease 350ms";
        el.style.opacity = "";
      });
    });
  }

  function init() {
    const plot = document.getElementById("curve-plot");
    const detail = document.getElementById("curve-detail");
    if (!plot || !detail) return;

    // Pull saved cat data if present
    try {
      const saved = parseInt(localStorage.getItem("peticine-cat-age"), 10);
      if (saved >= 1 && saved <= 25) catAge = saved;
      catName = localStorage.getItem("peticine-cat-name") || null;
    } catch (e) {}

    plot.innerHTML = buildSVG();
    plot.insertAdjacentHTML("beforeend", renderGain());
    const svgRoot = plot.querySelector(".curve-svg");

    const initial = stageForAge(catAge) || "mature";
    selectStage(initial, svgRoot, detail);

    // Interactions
    svgRoot.querySelectorAll(".curve-zone").forEach((zone) => {
      zone.addEventListener("click", () => selectStage(zone.dataset.stage, svgRoot, detail));
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectStage(zone.dataset.stage, svgRoot, detail);
        }
      });
    });
    svgRoot.querySelectorAll(".curve-stage-dot").forEach((dot) => {
      dot.addEventListener("click", () => selectStage(dot.dataset.stage, svgRoot, detail));
    });

    updateHere(svgRoot);

    // Animate when section scrolls into view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateIn(svgRoot);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(plot);

    // Expose update hook for age personalization
    window.peticineUpdateCurve = function (age, name) {
      if (age != null) catAge = age;
      if (name) catName = name;
      updateHere(svgRoot);
      const gainEl = document.getElementById("curve-gain");
      if (gainEl) gainEl.outerHTML = renderGain();
      const sid = stageForAge(catAge);
      if (sid) selectStage(sid, svgRoot, detail);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
