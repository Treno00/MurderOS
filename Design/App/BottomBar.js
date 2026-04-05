import { jsx, jsxs } from "react/jsx-runtime";
import { useGame } from "../../Scripts/App/GameContext.js";
import { Clock, Wallet, FastForward, Play, PauseCircle, Network } from "lucide-react";
const BottomBar = () => {
  const { gameTime, playerBalance, timeSpeed, setSpeed, isConnectionBoardOpen, toggleConnectionBoard } = useGame();
  const days = ["Niedziela", "Poniedzia\u0142ek", "Wtorek", "\u015Aroda", "Czwartek", "Pi\u0105tek", "Sobota"];
  const dayName = days[gameTime.getDay()];
  const dateStr = gameTime.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = gameTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ jsxs("div", { className: "h-10 bg-agency-black border-t border-agency-border flex items-center justify-between px-4 shrink-0 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-agency-text font-mono text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-r border-agency-border pr-3", children: [
          /* @__PURE__ */ jsx("span", { className: "uppercase font-bold text-slate-500", children: dayName }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-300", children: dateStr })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-agency-main", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold tracking-widest", children: timeStr })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-px bg-agency-dark rounded border border-agency-border overflow-hidden h-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSpeed(0.1),
            className: `px-3 h-full flex items-center justify-center transition-colors ${timeSpeed === 0.1 ? "bg-agency-main text-black" : "text-slate-600 hover:bg-agency-panel hover:text-white"}`,
            title: "Wolno (x0.1)",
            children: /* @__PURE__ */ jsx(PauseCircle, { className: "w-3 h-3 fill-current" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-px bg-agency-border h-full" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSpeed(1),
            className: `px-3 h-full flex items-center justify-center transition-colors ${timeSpeed === 1 ? "bg-agency-main text-black" : "text-slate-600 hover:bg-agency-panel hover:text-white"}`,
            title: "Normalnie (x1)",
            children: /* @__PURE__ */ jsx(Play, { className: "w-3 h-3 fill-current" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-px bg-agency-border h-full" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSpeed(60),
            className: `px-3 h-full flex items-center justify-center transition-colors ${timeSpeed === 60 ? "bg-agency-alert text-black" : "text-slate-600 hover:bg-agency-panel hover:text-white"}`,
            title: "Szybko (x60)",
            children: /* @__PURE__ */ jsx(FastForward, { className: "w-3 h-3 fill-current" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: toggleConnectionBoard,
          className: `flex items-center gap-2 px-3 py-1 rounded border transition-colors ${isConnectionBoardOpen ? "bg-indigo-600 border-indigo-500 text-white" : "bg-agency-dark border-indigo-900/30 text-indigo-400 hover:bg-indigo-900/20"}`,
          children: [
            /* @__PURE__ */ jsx(Network, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider", children: "Tablica Powi\u0105za\u0144" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-emerald-500 font-mono text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-slate-600 font-bold tracking-wider", children: "Dost\u0119pne \u015Arodki" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-agency-dark px-3 py-1 rounded border border-emerald-900/30", children: [
          /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
            playerBalance.toFixed(2),
            " PLN"
          ] })
        ] })
      ] })
    ] })
  ] });
};
var stdin_default = BottomBar;
export {
  stdin_default as default
};
