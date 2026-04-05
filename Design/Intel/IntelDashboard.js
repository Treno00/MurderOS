import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { IntelModule } from "../../Shared/types.js";
import {
  Users,
  Building2,
  CreditCard,
  Siren,
  Activity,
  FileText,
  GraduationCap,
  MapPin,
  ArrowLeft,
  Loader2,
  Camera,
  Briefcase,
  Share2,
  Landmark,
  ShieldAlert,
  Navigation,
  UserX,
  AlertTriangle,
  Key,
  Globe
} from "lucide-react";
import BankingSystem from "./Finances/BankingSystem.js";
import CarRental from "./Finances/CarRental.js";
import PoliceDatabase from "./LawEnforcement/PoliceDatabase.js";
import ConnectionBoard from "./Connections/ConnectionBoard.js";
import FaceNet from "./SocialMedia/FaceNet.js";
import InstaNet from "./SocialMedia/InstaNet.js";
import WorkLink from "./SocialMedia/WorkLink.js";
import ResidentRegistry from "./StateRegistries/ResidentRegistry.js";
import TaxRegistry from "./StateRegistries/TaxRegistry.js";
import MedicalRecord from "./StateRegistries/MedicalRecord.js";
import EducationSystem from "./StateRegistries/EducationSystem.js";
import Observation from "./FieldOps/Observation.js";
import CityMap from "./FieldOps/CityMap.js";
import GpsTracking from "./FieldOps/GpsTracking.js";
import Interview from "./FieldOps/Interview.js";
import VehicleTracking from "./FieldOps/VehicleTracking.js";
import GeographicAnalysis from "./FieldOps/GeographicAnalysis.js";
import Insurance from "./Finances/Insurance.js";
import { useGame } from "../../Scripts/App/GameContext.js";
import PoliceInvestigations from "./LawEnforcement/PoliceInvestigations.js";
import DarkMarket from "./DarkWeb/DarkMarket.js";
import DarkMissions from "./DarkWeb/DarkMissions.js";
import DarkShop from "./DarkWeb/DarkShop.js";
const CATEGORIES = [
  {
    id: "SOCIAL_MEDIA",
    title: "MEDIA SPO\u0141ECZNO\u015ACIOWE",
    icon: Share2,
    color: "text-blue-400",
    border: "hover:border-blue-400",
    bg: "hover:bg-blue-400/10",
    modules: [
      { id: IntelModule.FACE_NET, icon: Users, color: "text-blue-500", border: "hover:border-blue-500", bg: "hover:bg-blue-500/10" },
      { id: IntelModule.INSTA_NET, icon: Camera, color: "text-pink-500", border: "hover:border-pink-500", bg: "hover:bg-pink-500/10" },
      { id: IntelModule.WORK_LINK, icon: Briefcase, color: "text-sky-500", border: "hover:border-sky-500", bg: "hover:bg-sky-500/10" }
    ]
  },
  {
    id: "STATE_REGISTRIES",
    title: "REJESTRY PA\u0143STWOWE",
    icon: Landmark,
    color: "text-orange-400",
    border: "hover:border-orange-400",
    bg: "hover:bg-orange-400/10",
    modules: [
      { id: IntelModule.RESIDENT_REGISTRY, icon: Building2, color: "text-orange-500", border: "hover:border-orange-500", bg: "hover:bg-orange-500/10" },
      { id: IntelModule.TAX_REGISTRY, icon: FileText, color: "text-yellow-500", border: "hover:border-yellow-500", bg: "hover:bg-yellow-500/10" },
      { id: IntelModule.EDUCATION_SYSTEM, icon: GraduationCap, color: "text-purple-500", border: "hover:border-purple-500", bg: "hover:bg-purple-500/10" },
      { id: IntelModule.MEDICAL_RECORD, icon: Activity, color: "text-rose-500", border: "hover:border-rose-500", bg: "hover:bg-rose-500/10" }
    ]
  },
  {
    id: "FINANCES",
    title: "FINANSE",
    icon: CreditCard,
    color: "text-emerald-400",
    border: "hover:border-emerald-400",
    bg: "hover:bg-emerald-400/10",
    modules: [
      { id: IntelModule.INSURANCE, icon: ShieldAlert, color: "text-blue-500", border: "hover:border-blue-500", bg: "hover:bg-blue-500/10" },
      { id: IntelModule.CAR_RENTAL, icon: Key, color: "text-orange-500", border: "hover:border-orange-500", bg: "hover:bg-orange-500/10" },
      { id: IntelModule.BANKING_SYSTEM, icon: CreditCard, color: "text-emerald-500", border: "hover:border-emerald-500", bg: "hover:bg-emerald-500/10" }
    ]
  },
  {
    id: "LAW_ENFORCEMENT",
    title: "ORGANY \u015ACIGANIA",
    icon: ShieldAlert,
    color: "text-red-400",
    border: "hover:border-red-400",
    bg: "hover:bg-red-400/10",
    modules: [
      { id: IntelModule.MISSING_PERSONS, icon: UserX, color: "text-blue-500", border: "hover:border-blue-500", bg: "hover:bg-blue-500/10" },
      { id: IntelModule.WANTED_LIST, icon: AlertTriangle, color: "text-red-500", border: "hover:border-red-500", bg: "hover:bg-red-500/10" },
      // Renamed in UI via mapping if needed, or just ID
      { id: IntelModule.POLICE_INVESTIGATION, icon: FileText, color: "text-amber-500", border: "hover:border-amber-500", bg: "hover:bg-amber-500/10" },
      { id: IntelModule.POLICE_REGISTRY, icon: Siren, color: "text-slate-400", border: "hover:border-slate-400", bg: "hover:bg-slate-400/10" }
    ]
  },
  {
    id: "FIELD_OPS",
    title: "DZIA\u0141ANIA TERENOWE",
    icon: Navigation,
    color: "text-cyan-400",
    border: "hover:border-cyan-400",
    bg: "hover:bg-cyan-400/10",
    modules: [
      { id: IntelModule.FIELD_OBSERVATION, icon: MapPin, color: "text-cyan-500", border: "hover:border-cyan-500", bg: "hover:bg-cyan-500/10" },
      { id: IntelModule.CITY_MAP, icon: MapPin, color: "text-green-500", border: "hover:border-green-500", bg: "hover:bg-green-500/10" },
      { id: IntelModule.FIELD_GPS, icon: MapPin, color: "text-emerald-500", border: "hover:border-emerald-500", bg: "hover:bg-emerald-500/10" },
      { id: IntelModule.GEOGRAPHIC_ANALYSIS, icon: Globe, color: "text-teal-500", border: "hover:border-teal-500", bg: "hover:bg-teal-500/10" },
      { id: IntelModule.FIELD_INTERVIEW, icon: MapPin, color: "text-purple-500", border: "hover:border-purple-500", bg: "hover:bg-purple-500/10" },
    ]
  },
  {
    id: "DARK_WEB",
    title: "DARK WEB",
    icon: Globe,
    color: "text-zinc-400",
    border: "hover:border-zinc-400",
    bg: "hover:bg-zinc-400/10",
    modules: [
      { id: "DATA_BROKER", icon: Landmark, color: "text-zinc-500", border: "hover:border-zinc-500", bg: "hover:bg-zinc-500/10" },
      { id: "ZLECENIA", icon: Activity, color: "text-red-500", border: "hover:border-red-500", bg: "hover:bg-red-500/10" },
      { id: "RYNEK", icon: CreditCard, color: "text-emerald-500", border: "hover:border-emerald-500", bg: "hover:bg-emerald-500/10" },
      { id: "ORGANY", icon: Activity, color: "text-slate-500", border: "hover:border-slate-500", bg: "hover:bg-slate-500/10", locked: true }
    ]
  }
];
const IntelDashboard = ({ onBack }) => {
  const { settings } = useGame();
  const [activeModule, setActiveModule] = useState(IntelModule.MENU);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleModuleSelect = (id) => {
    if (!settings.noLoading) {
      setIsLoading(true);
      const delay = Math.floor(Math.random() * (1200 - 400 + 1) + 400);
      setTimeout(() => {
        if (isMounted.current) {
          setActiveModule(id);
          setIsLoading(false);
        }
      }, delay);
    } else {
      setActiveModule(id);
    }
  };
  const renderModule = () => {
    switch (activeModule) {
      case IntelModule.BANKING_SYSTEM:
        return /* @__PURE__ */ jsx(BankingSystem, {});
      case IntelModule.MISSING_PERSONS:
        return /* @__PURE__ */ jsx(PoliceDatabase, { mode: "ZAGINIENI" });
      case IntelModule.WANTED_LIST:
        return /* @__PURE__ */ jsx(PoliceDatabase, { mode: "POSZUKIWANI" });
      case IntelModule.POLICE_REGISTRY:
        return /* @__PURE__ */ jsx(PoliceDatabase, { mode: "BAZA" });
      case IntelModule.FACE_NET:
        return /* @__PURE__ */ jsx(FaceNet, {});
      case IntelModule.INSTA_NET:
        return /* @__PURE__ */ jsx(InstaNet, {});
      case IntelModule.WORK_LINK:
        return /* @__PURE__ */ jsx(WorkLink, {});
      case IntelModule.RESIDENT_REGISTRY:
        return /* @__PURE__ */ jsx(ResidentRegistry, {});
      case IntelModule.TAX_REGISTRY:
        return /* @__PURE__ */ jsx(TaxRegistry, {});
      case IntelModule.MEDICAL_RECORD:
        return /* @__PURE__ */ jsx(MedicalRecord, {});
      case IntelModule.EDUCATION_SYSTEM:
        return /* @__PURE__ */ jsx(EducationSystem, {});
      case IntelModule.FIELD_OBSERVATION:
        return /* @__PURE__ */ jsx(Observation, {});
      case IntelModule.CITY_MAP:
        return /* @__PURE__ */ jsx(CityMap, {});
      case IntelModule.FIELD_GPS:
        return /* @__PURE__ */ jsx(GpsTracking, {});
      case IntelModule.GEOGRAPHIC_ANALYSIS:
        return /* @__PURE__ */ jsx(GeographicAnalysis, {});
      case IntelModule.FIELD_INTERVIEW:
        return /* @__PURE__ */ jsx(Interview, {});
      case IntelModule.FIELD_VEHICLE:
        return /* @__PURE__ */ jsx(VehicleTracking, {});
      case IntelModule.INSURANCE:
        return /* @__PURE__ */ jsx(Insurance, {});
      case IntelModule.CAR_RENTAL:
        return /* @__PURE__ */ jsx(CarRental, {});
      case IntelModule.CONNECTION_BOARD:
        return /* @__PURE__ */ jsx(ConnectionBoard, {});
      case IntelModule.POLICE_INVESTIGATION:
        return /* @__PURE__ */ jsx(PoliceInvestigations, {});
      case "DATA_BROKER":
        return /* @__PURE__ */ jsx(DarkMarket, {});
      case "ZLECENIA":
        return /* @__PURE__ */ jsx(DarkMissions, {});
      case "RYNEK":
        return /* @__PURE__ */ jsx(DarkShop, {});
      default:
        return null;
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center bg-agency-black animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-12 h-12 text-agency-main animate-spin mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "text-agency-main font-mono text-sm tracking-widest animate-pulse", children: "NAWI\u0104ZYWANIE PO\u0141\u0104CZENIA..." })
    ] });
  }
  if (activeModule !== IntelModule.MENU) {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-agency-black", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-agency-border bg-agency-dark shrink-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveModule(IntelModule.MENU),
            className: "flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              " POWR\xD3T"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-[1px] bg-agency-border" }),
        /* @__PURE__ */ jsx("h2", { className: "text-agency-main font-bold tracking-widest uppercase text-sm", children: activeModule })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden p-4", children: renderModule() })
    ] });
  }
  if (activeCategory) {
    const category = CATEGORIES.find((c) => c.id === activeCategory);
    if (!category) return null;
    return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto p-8 bg-agency-black", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveCategory(null),
            className: "flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              " WSTECZ"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white pl-4 border-l-4 border-agency-main", children: [
          category.title,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-600 font-normal text-sm ml-2", children: "// WYBIERZ MODU\u0141" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: category.modules.map((mod) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleModuleSelect(mod.id),
          className: `
                group relative p-5 h-36 bg-agency-dark border border-agency-border 
                rounded text-left transition-all duration-300
                ${mod.border} ${mod.bg}
                flex flex-col justify-between
                shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]
              `,
          children: [
            /* @__PURE__ */ jsx("div", { className: `absolute top-4 right-4 ${mod.color} opacity-40 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300`, children: /* @__PURE__ */ jsx(mod.icon, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto", children: [
              /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-mono text-slate-600 group-hover:text-slate-400`, children: [
                "ACCESS_KEY_0",
                category.modules.indexOf(mod) + 1
              ] }),
              /* @__PURE__ */ jsxs("h3", { className: `text-sm font-bold text-slate-200 mt-1 group-hover:text-white group-hover:tracking-wider transition-all`, children: [
                mod.id,
                mod.locked && " (ZABLOKOWANE)"
              ] })
            ] })
          ]
        },
        mod.id
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto p-8 bg-agency-black", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white mb-6 pl-2 border-l-4 border-agency-main", children: [
      "CENTRUM WYWIADU ",
      /* @__PURE__ */ jsx("span", { className: "text-slate-600 font-normal text-sm ml-2", children: "// KATEGORIE" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveCategory(cat.id),
        className: `
              group relative p-5 h-36 bg-agency-dark border border-agency-border 
              rounded text-left transition-all duration-300
              ${cat.border} ${cat.bg}
              flex flex-col justify-between
              shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]
            `,
        children: [
          /* @__PURE__ */ jsx("div", { className: `absolute top-4 right-4 ${cat.color} opacity-40 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300`, children: /* @__PURE__ */ jsx(cat.icon, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto", children: [
            /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-mono text-slate-600 group-hover:text-slate-400`, children: [
              "CATEGORY_KEY_0",
              CATEGORIES.indexOf(cat) + 1
            ] }),
            /* @__PURE__ */ jsx("h3", { className: `text-sm font-bold text-slate-200 mt-1 group-hover:text-white group-hover:tracking-wider transition-all`, children: cat.title })
          ] })
        ]
      },
      cat.id
    )) })
  ] });
};
var stdin_default = IntelDashboard;
export {
  stdin_default as default
};
