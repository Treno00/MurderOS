import { jsx, jsxs } from "react/jsx-runtime";
import { FileSearch, FolderOpen } from "lucide-react";
const InvestigationDashboard = () => {
  return /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center bg-agency-black text-slate-500", children: /* @__PURE__ */ jsxs("div", { className: "p-8 border border-slate-800 rounded-lg bg-agency-dark flex flex-col items-center", children: [
    /* @__PURE__ */ jsx(FileSearch, { className: "w-16 h-16 mb-4 text-slate-700" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold uppercase tracking-widest mb-2", children: "Modu\u0142 \u015Aledczy" }),
    /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-center max-w-xs opacity-70 mb-6", children: "Zarz\u0105dzanie aktywnymi post\u0119powaniami, analiza dowod\xF3w i \u0142\u0105czenie fakt\xF3w." }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] font-mono text-agency-alert border border-agency-alert/30 px-3 py-1.5 rounded bg-agency-alert/10", children: [
      /* @__PURE__ */ jsx(FolderOpen, { className: "w-3 h-3" }),
      " BRAK AKTYWNYCH \u015ALEDZTW"
    ] })
  ] }) });
};
var stdin_default = InvestigationDashboard;
export {
  stdin_default as default
};
