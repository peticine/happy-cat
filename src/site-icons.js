import {
  createIcons,
  Activity,
  BookOpen,
  Bug,
  Cat,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplets,
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
  Stethoscope,
  Check,
} from "lucide";

const FELICA_ICONS = {
  Activity,
  BookOpen,
  Bug,
  Cat,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplets,
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
  Stethoscope,
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
