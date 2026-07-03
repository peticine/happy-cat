import {
  createIcons,
  Activity,
  BookOpen,
  Cat,
  ClipboardList,
  Clock,
  HeartPulse,
  ListChecks,
  Lock,
  MapPin,
  Moon,
  Phone,
  Scale,
  Search,
  Shield,
  Sparkles,
  Toilet,
  TrendingUp,
  UserRound,
  Users,
  Utensils,
  Wind,
  Zap,
} from "lucide";

const FELICA_ICONS = {
  Activity,
  BookOpen,
  Cat,
  ClipboardList,
  Clock,
  HeartPulse,
  ListChecks,
  Lock,
  MapPin,
  Moon,
  Phone,
  Scale,
  Search,
  Shield,
  Sparkles,
  Toilet,
  TrendingUp,
  UserRound,
  Users,
  Utensils,
  Wind,
  Zap,
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
