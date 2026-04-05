import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Navigation from "./Navigation.js";
import IntelDashboard from "../Intel/IntelDashboard.js";
import InvestigationDashboard from "../Investigation/InvestigationDashboard.js";
import VictimFilePanel from "./VictimFilePanel.js";
import BottomBar from "./BottomBar.js";
import ActionDashboard from "../Action/ActionDashboard.js";
import ConnectionBoard from "../Intel/Connections/ConnectionBoard.js";
import HideoutDashboard from "../Hideout/HideoutDashboard.js";
import { MainView } from "../../Shared/types.js";
import { Lock, ShieldAlert, MonitorX, FileWarning } from "lucide-react";
import { useGame } from "../../Scripts/App/GameContext.js";
const MainLayout = () => {
  const [currentView, setCurrentView] = useState(MainView.INTEL);
  const { isConnectionBoardOpen } = useGame();
  const renderContent = () => {
    switch (currentView) {
      case MainView.INTEL:
        return /* @__PURE__ */ jsx(IntelDashboard, { onBack: () => {
        } });
      case MainView.HIDEOUT:
        return /* @__PURE__ */ jsx(HideoutDashboard, {});
      case MainView.INVESTIGATION:
        return /* @__PURE__ */ jsx(InvestigationDashboard, {});
      case MainView.ACTION:
        return /* @__PURE__ */ jsx(ActionDashboard, {});
      default:
        return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 bg-agency-black animate-in fade-in duration-500 p-8 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none opacity-5",
              style: { background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative mb-8 p-10 border-2 border-agency-border/50 rounded-lg bg-agency-dark/50 backdrop-blur-sm flex flex-col items-center shadow-[0_0_50px_rgba(239,68,68,0.05)]", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-agency-danger" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-agency-danger" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-agency-danger" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-agency-danger" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
              /* @__PURE__ */ jsx(ShieldAlert, { className: "w-32 h-32 text-agency-dark/80" }),
              /* @__PURE__ */ jsx(Lock, { className: "w-16 h-16 text-agency-alert absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black uppercase tracking-[0.3em] text-agency-text mb-2 text-center", children: "Dost\u0119p Zabroniony" }),
            /* @__PURE__ */ jsx("div", { className: "h-px w-32 bg-agency-alert/50 my-4" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-sm opacity-70 text-center max-w-md leading-relaxed text-slate-400", children: [
              "Modu\u0142 ",
              /* @__PURE__ */ jsx("span", { className: "text-agency-danger font-bold uppercase", children: currentView }),
              " nie jest dost\u0119pny dla Twojego poziomu uprawnie\u0144 (Poziom 1). Skontaktuj si\u0119 z administratorem systemu."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border border-agency-alert/30 text-agency-alert text-[10px] font-mono bg-agency-alert/5 rounded flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FileWarning, { className: "w-3 h-3" }),
                "CODE: ACCESS_LEVEL_LOW"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border border-slate-700/50 text-slate-500 text-[10px] font-mono bg-slate-800/20 rounded flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MonitorX, { className: "w-3 h-3" }),
                "TERMINAL_LOCKED"
              ] })
            ] })
          ] })
        ] });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen bg-agency-black text-slate-200 font-sans selection:bg-agency-main selection:text-white overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none z-50 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22 opacity=%220.4%22/%3E%3C/svg%3E')]" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.05]",
          style: {
            background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            backgroundSize: "100% 2px, 3px 100%"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden relative z-10", children: [
      /* @__PURE__ */ jsx(Navigation, { currentView, setView: setCurrentView }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col relative min-w-0 bg-agency-black transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden relative", children: renderContent() }),
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 z-50 bg-slate-950 transition-all duration-300 ${isConnectionBoardOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`, children: /* @__PURE__ */ jsx(ConnectionBoard, {}) })
      ] }),
      /* @__PURE__ */ jsx(VictimFilePanel, {})
    ] }),
    /* @__PURE__ */ jsx(BottomBar, {})
  ] });
};
var stdin_default = MainLayout;
export {
  stdin_default as default
};
