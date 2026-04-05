import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MainView } from "../../Shared/types.js";
import { Eye, Home, Zap, FileSearch, Menu, ChevronLeft, ShieldCheck, AlertTriangle, Settings, X, Sun, Moon, Volume2, Lock } from "lucide-react";
import { useGame } from "../../Scripts/App/GameContext.js";
const Navigation = ({ currentView, setView }) => {
  const { isNavOpen, toggleNav, suspicion, setSuspicion, playerBalance, updateBalance, settings, updateSettings } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const navItems = [
    { id: MainView.INTEL, icon: Eye, label: "WYWIAD", locked: false, description: "Bazy Danych i Inwigilacja" },
    { id: MainView.HIDEOUT, icon: Home, label: "KRYJÓWKA", locked: false, description: "Baza Operacyjna i Magazyn" },
    { id: MainView.ACTION, icon: Zap, label: "AKCJA", locked: false, description: "Centrum Operacji Zbrojnych" },
    { id: MainView.INVESTIGATION, icon: FileSearch, label: "ŚLEDZTWA", locked: true, description: "Brak aktywnych postępowań" }
  ];
  const handleHeatClick = () => {
    if (suspicion <= 0) return;
    const cost = suspicion * 1e3;
    const formattedCost = cost.toLocaleString("pl-PL");
    if (window.confirm(`Zap\u0142aci\u0107 ${formattedCost},- z\u0142 by obni\u017Cy\u0107 zawarto\u015B\u0107 o po\u0142ow\u0119?`)) {
      if (playerBalance >= cost) {
        updateBalance(-cost);
        setSuspicion((prev) => parseFloat((prev / 2).toFixed(1)));
      } else {
        alert("BRAK \u015ARODK\xD3W NA KONCIE");
      }
    }
  };
  const getHeatColor = () => {
    if (suspicion < 30) return "bg-agency-success";
    if (suspicion < 70) return "bg-agency-alert";
    return "bg-agency-danger";
  };
  const colors = [
    { id: "AGENCY", hex: "#0ea5e9", name: "Agency Sky" },
    { id: "SOCIAL", hex: "#3b82f6", name: "Social Blue" },
    { id: "RESIDENT", hex: "#f97316", name: "Resident Orange" },
    { id: "BANKING", hex: "#10b981", name: "Banking Emerald" },
    { id: "POLICE", hex: "#ef4444", name: "Police Red" },
    { id: "MEDICAL", hex: "#f43f5e", name: "Medical Rose" },
    { id: "TAX", hex: "#eab308", name: "Tax Yellow" },
    { id: "EDUCATION", hex: "#a855f7", name: "Education Purple" },
    { id: "FIELD", hex: "#06b6d4", name: "Field Cyan" },
    { id: "MATRIX", hex: "#22c55e", name: "Matrix Green" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "nav",
      {
        className: `
            bg-agency-black border-r border-agency-border flex flex-col justify-between py-6 transition-all duration-300 relative
            ${isNavOpen ? "w-64" : "w-16"}
            shadow-[4px_0_15px_-3px_rgba(0,0,0,0.5)] z-40
        `,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleNav,
              className: "absolute -right-5 top-1/2 -translate-y-1/2 bg-agency-panel border border-agency-border border-l-0 rounded-r w-5 h-12 flex items-center justify-center text-agency-text hover:text-white hover:bg-agency-main hover:border-agency-main transition-all z-50 shadow-lg cursor-pointer",
              children: isNavOpen ? /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Menu, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 px-2", children: [
            /* @__PURE__ */ jsx("div", { className: `mb-10 transition-all duration-300 flex items-center justify-center overflow-hidden h-12 ${isNavOpen ? "opacity-100" : "opacity-100"}`, children: isNavOpen ? /* @__PURE__ */ jsxs("div", { className: "text-center animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-agency-main" }),
                /* @__PURE__ */ jsxs("h1", { className: "text-lg font-bold text-white tracking-widest", children: [
                  "AGENCY",
                  /* @__PURE__ */ jsx("span", { className: "text-agency-main", children: "OS" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] text-agency-text font-mono tracking-[0.2em] border-t border-agency-border pt-1", children: "INTELLIGENCE SUITE" })
            ] }) : /* @__PURE__ */ jsx(ShieldCheck, { className: "w-8 h-8 text-agency-main" }) }),
            /* @__PURE__ */ jsx("div", { className: "space-y-1", children: navItems.map((item) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => !item.locked && setView(item.id),
                disabled: item.locked,
                className: `
                w-full flex items-center gap-4 p-3 rounded transition-all duration-200 group overflow-hidden relative
                ${currentView === item.id ? "bg-agency-dark text-agency-main border-l-2 border-agency-main" : item.locked ? "text-slate-700 opacity-40 cursor-not-allowed hover:bg-transparent" : "text-agency-text hover:text-white hover:bg-agency-dark border-l-2 border-transparent"}
                `,
                title: item.locked ? item.description : item.label,
                children: [
                  /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 shrink-0 ${currentView === item.id ? "" : item.locked ? "text-slate-800" : "opacity-50"}` }),
                  /* @__PURE__ */ jsxs("span", { className: `font-semibold text-xs tracking-wider whitespace-nowrap transition-opacity duration-300 flex items-center justify-between flex-1 ${isNavOpen ? "opacity-100" : "opacity-0 hidden"}`, children: [
                    item.id,
                    item.locked && /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-slate-800" })
                  ] }),
                  !isNavOpen && item.locked && /* @__PURE__ */ jsx("div", { className: "absolute left-14 bg-black border border-slate-800 p-2 rounded w-48 hidden group-hover:block z-50 text-[10px] text-slate-500 font-mono", children: item.description })
                ]
              },
              item.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `px-4 transition-opacity duration-300 ${isNavOpen ? "opacity-100" : "opacity-0 hidden"}`, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowSettings(true),
                className: "w-full mb-4 flex items-center justify-between text-slate-500 hover:text-white transition-colors p-2 rounded hover:bg-white/5",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: "Opcje" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `border-t border-agency-border pt-4 ${suspicion > 0 ? "cursor-pointer hover:bg-white/5 transition-colors p-2 rounded" : ""}`,
                onClick: handleHeatClick,
                title: suspicion > 0 ? "Kliknij, aby zmniejszy\u0107 zainteresowanie (\u0141ap\xF3wka)" : "Brak zainteresowania",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] text-slate-600 font-mono mb-1", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(AlertTriangle, { className: `w-3 h-3 ${suspicion > 0 ? "text-agency-alert" : "text-slate-700"}` }),
                      "Zainteresowanie"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: suspicion > 50 ? "text-agency-danger font-bold" : "text-agency-text", children: [
                      suspicion.toFixed(1),
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-full bg-agency-dark h-1.5 rounded-full overflow-hidden border border-agency-border/50", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `h-full transition-all duration-500 ${getHeatColor()}`,
                      style: { width: `${Math.min(suspicion, 100)}%` }
                    }
                  ) })
                ]
              }
            )
          ] })
        ]
      }
    ),
    showSettings && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in zoom-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-agency-main w-[500px] flex flex-col shadow-2xl relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowSettings(false),
          className: "absolute top-2 right-2 text-slate-500 hover:text-white transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-agency-border bg-black/50", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-agency-main flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5" }),
        " KONFIGURACJA SYSTEMU"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-agency-border pb-1", children: "Odczucie Gry" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm text-slate-300 mb-2", children: "Kolorystyka Interfejsu" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: colors.map((c) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateSettings({ themeId: c.id }),
                  className: `w-8 h-8 rounded-full border-2 transition-all ${settings.themeId === c.id ? "border-white scale-110" : "border-transparent hover:border-slate-500"}`,
                  style: { backgroundColor: c.hex },
                  title: c.name
                },
                c.id
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-300", children: [
                settings.nightMode ? /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-agency-main" }) : /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Tryb Nocny" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateSettings({ nightMode: !settings.nightMode }),
                  className: `w-10 h-5 rounded-full relative transition-colors ${settings.nightMode ? "bg-agency-main" : "bg-slate-700"}`,
                  children: /* @__PURE__ */ jsx("div", { className: `w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.nightMode ? "left-6" : "left-1"}` })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "DarkMode",
                value: settings.darkMode,
                onChange: () => updateSettings({ darkMode: !settings.darkMode })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "opacity-50", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-300 mb-2", children: [
                /* @__PURE__ */ jsx(Volume2, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "G\u0142o\u015Bno\u015B\u0107 Efekt\xF3w" })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "range", className: "w-full accent-agency-main h-1 bg-slate-800 rounded appearance-none", disabled: true, value: settings.sfxVolume })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-agency-border pb-1", children: "Ustawienia Gry" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Automatyczne wpisywanie (Auto-Fill)",
                value: settings.autoFill,
                onChange: () => updateSettings({ autoFill: !settings.autoFill })
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Pobieranie danych do teczki",
                value: settings.showDownloadBtn,
                onChange: () => updateSettings({ showDownloadBtn: !settings.showDownloadBtn })
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Pod\u015Bwietl sp\xF3jno\u015B\u0107 w teczce",
                value: settings.highlightConsistency,
                onChange: () => updateSettings({ highlightConsistency: !settings.highlightConsistency })
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Brak dekodowania (Natychmiast)",
                value: settings.noDecoding,
                onChange: () => updateSettings({ noDecoding: !settings.noDecoding })
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Brak uruchamiania (Szybkie Menu)",
                value: settings.noLoading,
                onChange: () => updateSettings({ noLoading: !settings.noLoading })
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleItem,
              {
                label: "Ignoruj cisz\u0119 nocn\u0105",
                value: settings.ignoreQuietHours,
                onChange: () => updateSettings({ ignoreQuietHours: !settings.ignoreQuietHours })
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const ToggleItem = ({ label, value, onChange, disabled }) => /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between ${disabled ? "opacity-50 pointer-events-none" : ""}`, children: [
  /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-300", children: label }),
  /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onChange,
      className: `w-10 h-5 rounded-full relative transition-colors ${value ? "bg-agency-main" : "bg-slate-700"}`,
      children: /* @__PURE__ */ jsx("div", { className: `w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${value ? "left-6" : "left-1"}` })
    }
  )
] });
var stdin_default = Navigation;
export {
  stdin_default as default
};
