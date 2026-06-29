import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AbstractBackdrop, AbstractStepArt } from "./AbstractArt.jsx";
import {
  catToHumanAge,
  getAgeProfile,
  JOURNEY_STEPS,
  RECOMMENDED_TESTS,
  SYMPTOMS,
} from "./ageProfile.js";
import "./age-journey.css";

const STEP_LABELS = ["About your cat", "Age context", "Signs", "Assessment", "Next steps"];

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
};

function displayName(name) {
  const trimmed = name.trim();
  return trimmed || "Your cat";
}

export default function AgeJourney() {
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [name, setName] = useState("");
  const [years, setYears] = useState(null);
  const [symptoms, setSymptoms] = useState(() => new Set());

  const profile = years ? getAgeProfile(years) : null;
  const catLabel = displayName(name);
  const humanYears = years ? catToHumanAge(years) : 0;
  const hasSymptoms = symptoms.size > 0;
  const canSubmit = nameInput.trim() && parseInt(ageInput, 10) >= 1;

  const vetMailto = useMemo(() => {
    const selected = SYMPTOMS.filter((s) => symptoms.has(s.id)).map((s) => s.label);
    const subject = encodeURIComponent(`${catLabel} — request vet consultation`);
    const body = encodeURIComponent(
      `Cat: ${catLabel}\nAge: ${years} years (${humanYears} human years)\n\nSigns noticed:\n${
        selected.length ? selected.map((s) => `- ${s}`).join("\n") : "- None selected"
      }\n\nI'd like a veterinarian to review whether testing is needed.`
    );
    return `mailto:hello@peticine.com?subject=${subject}&body=${body}`;
  }, [catLabel, years, humanYears, symptoms]);

  useEffect(() => {
    const bridge = window.peticineAgeBridge;
    if (!bridge) return;
    if (bridge.getSavedAge?.()) setAgeInput(String(bridge.getSavedAge()));
    if (bridge.getSavedName?.()) setNameInput(bridge.getSavedName());

    const onReset = () => {
      setStep(0);
      setYears(null);
      setName("");
      setSymptoms(new Set());
      setAgeInput(bridge.getSavedAge?.() ? String(bridge.getSavedAge()) : "");
      setNameInput(bridge.getSavedName?.() || "");
    };
    window.addEventListener("peticine-age-reset", onReset);
    return () => window.removeEventListener("peticine-age-reset", onReset);
  }, []);

  useEffect(() => {
    if (!profile?.theme) return;
    document.getElementById("age-gate")?.classList.add(`age-theme-${profile.theme}`, "age-gate-showing-result");
    document.body.dataset.ageTheme = profile.theme;
  }, [profile?.theme]);

  useEffect(() => {
    document.getElementById("age-gate")?.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const submitIntake = () => {
    const parsed = parseInt(ageInput, 10);
    if (!parsed || parsed < 1 || parsed > 25) return;
    setName(nameInput.trim());
    setYears(parsed);
    setStep(1);
  };

  const toggleSymptom = (id) => {
    setSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const complete = () => {
    window.peticineAgeBridge?.complete?.(years, profile, {
      name: catLabel,
      symptoms: [...symptoms],
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <p className="aj-eyebrow">Step 1</p>
            <h1 className="aj-title">How old is your cat?</h1>
            <p className="aj-sub">Their age shapes what to watch for. We'll place them on the journey and outline sensible next steps.</p>
            <form
              className="aj-form"
              onSubmit={(e) => {
                e.preventDefault();
                submitIntake();
              }}
            >
              <label className="aj-field">
                <span className="aj-label">Name</span>
                <input
                  className="aj-input"
                  type="text"
                  placeholder="Lina"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                />
              </label>
              <label className="aj-field">
                <span className="aj-label">Age</span>
                <div className="aj-input-row">
                  <input
                    className="aj-input aj-input-num"
                    type="number"
                    min="1"
                    max="25"
                    inputMode="numeric"
                    placeholder="11"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    required
                  />
                  <span className="aj-input-unit">years</span>
                </div>
              </label>
              <button type="submit" className="aj-btn" disabled={!canSubmit}>
                Continue
              </button>
            </form>
          </>
        );

      case 1:
        return (
          <>
            <div className="aj-stat-block">
              <span className="aj-stat-label">Cat years</span>
              <p className="aj-stat-value">
                {catLabel} is <em>{years}</em>
              </p>
            </div>
            <div className="aj-stat-block">
              <span className="aj-stat-label">Human equivalent</span>
              <p className="aj-stat-value">
                Like someone in <em>{profile.humanDecade}</em>
              </p>
              <p className="aj-stat-meta">{humanYears} human years</p>
            </div>
            <div className="aj-section">
              <p className="aj-section-title">More common at this age</p>
              <ul className="aj-list">
                {profile.conditions.map((item, i) => (
                  <li key={item}>
                    <span className="aj-list-num">{String(i + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="aj-btn" onClick={() => setStep(2)}>
              Continue
            </button>
          </>
        );

      case 2:
        return (
          <>
            <p className="aj-eyebrow">Step 3</p>
            <h1 className="aj-title">Have you noticed any of these?</h1>
            <p className="aj-sub">Select everything that applies. None is a valid answer.</p>
            <div className="aj-options">
              {SYMPTOMS.map((symptom) => {
                const on = symptoms.has(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    className={`aj-option${on ? " is-on" : ""}`}
                    onClick={() => toggleSymptom(symptom.id)}
                    aria-pressed={on}
                  >
                    <span className="aj-option-text">{symptom.label}</span>
                    <span className="aj-option-mark" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <button type="button" className="aj-btn" onClick={() => setStep(3)}>
              View assessment{symptoms.size > 0 ? ` · ${symptoms.size} selected` : ""}
            </button>
          </>
        );

      case 3:
        return (
          <>
            <span className={`aj-tag${hasSymptoms ? " aj-tag-alert" : ""}`}>
              {hasSymptoms ? "Signs noted" : "Assessment"}
            </span>
            <h1 className="aj-title aj-title-sm">
              {hasSymptoms
                ? `${catLabel} may be showing signs associated with kidney disease.`
                : `At ${years}, routine screening still matters.`}
            </h1>
            <p className="aj-sub">A veterinarian can help determine whether bloodwork or a visit is warranted.</p>
            <div className="aj-section">
              <p className="aj-section-title">Recommended tests</p>
              <ul className="aj-list aj-list-compact">
                {RECOMMENDED_TESTS.map((test) => (
                  <li key={test}>{test}</li>
                ))}
              </ul>
            </div>
            <button type="button" className="aj-btn" onClick={() => setStep(4)}>
              Request a consultation
            </button>
          </>
        );

      case 4:
        return (
          <>
            <p className="aj-eyebrow">Step 5</p>
            <h1 className="aj-title">Veterinary review</h1>
            <p className="aj-sub">
              A licensed veterinarian reviews {catLabel}'s profile — age {years}, signs noted — and recommends next steps.
            </p>
            <ul className="aj-bullets">
              <li>Age-calibrated symptom review</li>
              <li>Guidance on bloodwork & urinalysis</li>
              <li>Clear path: watch, test, or manage</li>
            </ul>
            <a className="aj-btn" href={vetMailto}>
              Request vet review
            </a>
            <button type="button" className="aj-link" onClick={complete}>
              Continue to Felica
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="aj-root">
      <AbstractBackdrop />

      <header className="aj-top">
        <a className="aj-logo" href="#top">
          Felica
        </a>
        <div className="aj-top-meta">
          <span className="aj-step-num">
            {String(step + 1).padStart(2, "0")} — {String(JOURNEY_STEPS.length).padStart(2, "0")}
          </span>
          <span className="aj-step-name">{STEP_LABELS[step]}</span>
        </div>
      </header>

      <div className="aj-progress-track" aria-hidden="true">
        <span className="aj-progress-fill" style={{ width: `${((step + 1) / JOURNEY_STEPS.length) * 100}%` }} />
      </div>

      <AbstractStepArt step={step} />

      <div className="aj-body">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="aj-page" {...page}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {step > 0 && step < 4 && (
        <footer className="aj-foot">
          <button type="button" className="aj-link" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </button>
        </footer>
      )}
    </div>
  );
}
