import { jsx, jsxs } from "react/jsx-runtime";
import { Briefcase, Download, Search, MapPin, Building, GraduationCap } from "lucide-react";
import { useWorkLink } from "../../../Scripts/Intel/SocialMedia/useWorkLink.js";
const WorkLink = () => {
  const {
    handle,
    setHandle,
    results,
    handleDownload,
    showDownloadBtn
  } = useWorkLink();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-slate-900 border border-blue-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-blue-900/30 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-blue-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Briefcase, { className: "w-5 h-5" }),
        "WorkLink"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] text-blue-400/70 uppercase font-bold mb-1 block", children: "Identyfikator Profilu" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: handle,
            onChange: (e) => setHandle(e.target.value),
            className: "w-full bg-black border border-blue-900/50 p-2 text-sm focus:border-blue-500 outline-none rounded text-blue-100 placeholder:text-blue-900/50 transition-all font-mono",
            placeholder: "imie.nazwisko"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-slate-900 border border-blue-900/30 rounded relative overflow-hidden flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-5 pointer-events-none",
          style: { backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10", children: results.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: results.map((citizen) => /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-blue-900/30 rounded-lg overflow-hidden shadow-md hover:border-blue-500/50 transition-colors group", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex gap-4 items-center border-b border-blue-900/30 bg-blue-900/10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-blue-100 text-lg tracking-wide", children: [
              citizen.firstName,
              " ",
              citizen.lastName
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-400/70 font-mono", children: citizen.socialMedia.workLinkHandle })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4 text-sm text-slate-300 font-mono", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-blue-500 font-bold uppercase mb-1", children: "Do\u015Bwiadczenie" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(Building, { className: "w-4 h-4 text-blue-400 mt-0.5" }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "font-bold text-white", children: citizen.jobTitle }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-blue-900/30", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-blue-500 font-bold uppercase mb-1", children: "Edukacja" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-blue-400" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-white", children: citizen.education })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 pl-6", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-blue-200", children: citizen.schoolName }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-slate-500 mt-1", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
                  " ",
                  citizen.schoolAddress
                ] })
              ] })
            ] })
          ] })
        ] }),
        showDownloadBtn && /* @__PURE__ */ jsx("div", { className: "p-3 bg-black/40 border-t border-blue-900/30 flex justify-end", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDownload(citizen),
            className: "text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors uppercase tracking-wider shadow-[0_0_10px_rgba(37,99,235,0.2)] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
              " ZAPISZ PROFIL"
            ]
          }
        ) })
      ] }, citizen.id)) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-blue-900/30", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-16 h-16 opacity-20 mb-4 animate-pulse" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-mono uppercase tracking-widest font-bold", children: "Wyszukaj specjalist\xF3w" })
      ] }) })
    ] })
  ] });
};
var stdin_default = WorkLink;
export {
  stdin_default as default
};
