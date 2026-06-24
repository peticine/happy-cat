import { createRoot } from "react-dom/client";
import AgeJourney from "./AgeJourney.jsx";

const rootEl = document.getElementById("age-journey-root");

if (rootEl) {
  createRoot(rootEl).render(<AgeJourney />);
}
