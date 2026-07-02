import {
  createIcons,
  Activity,
  BookOpen,
  Cat,
  HeartPulse,
  Moon,
  Phone,
  Sparkles,
  Users,
} from "lucide";

const FELICA_ICONS = {
  Activity,
  BookOpen,
  Cat,
  HeartPulse,
  Moon,
  Phone,
  Sparkles,
  Users,
};

const FELICA_ICON_ATTRS = {
  width: 20,
  height: 20,
  strokeWidth: 1.5,
};

function initFelicaIcons(root = document) {
  createIcons({
    icons: FELICA_ICONS,
    attrs: FELICA_ICON_ATTRS,
    root,
  });
}

initFelicaIcons();
window.initFelicaIcons = initFelicaIcons;
