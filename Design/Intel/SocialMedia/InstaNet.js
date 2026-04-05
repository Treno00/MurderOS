import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Camera, Download, Search, Hash, Car, Eye, Loader2, User, Phone, MapPin } from "lucide-react";
import { useInstaNet } from "../../../Scripts/Intel/SocialMedia/useInstaNet.js";
const InstaNet = () => {
  const {
    handle,
    setHandle,
    results,
    handleDownload,
    handleAnalyzeProfile,
    analyzingId,
    analyzedIds,
    showDownloadBtn
  } = useInstaNet();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-slate-900 border border-pink-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-pink-900/30 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-pink-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5" }),
        "InstaNet"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] text-pink-400/70 uppercase font-bold mb-1 block", children: "Nazwa U\u017Cytkownika (@)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: handle,
            onChange: (e) => setHandle(e.target.value),
            className: "w-full bg-black border border-pink-900/50 p-2 text-sm focus:border-pink-500 outline-none rounded text-pink-100 placeholder:text-pink-900/50 transition-all font-mono",
            placeholder: "@nazwa_uzytkownika"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-slate-900 border border-pink-900/30 rounded relative overflow-hidden flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-5 pointer-events-none",
          style: { backgroundImage: "linear-gradient(#ec4899 1px, transparent 1px), linear-gradient(90deg, #ec4899 1px, transparent 1px)", backgroundSize: "40px 40px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10", children: results.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: results.map((citizen) => /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-pink-900/30 rounded-lg overflow-hidden shadow-md hover:border-pink-500/50 transition-colors group", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex gap-4 items-center border-b border-pink-900/30 bg-pink-900/10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-600 via-pink-600 to-purple-600 p-[2px]", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-black rounded-full flex items-center justify-center text-pink-400", children: /* @__PURE__ */ jsx(Camera, { className: "w-6 h-6" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-pink-100 text-lg tracking-wide font-mono", children: citizen.socialMedia.instaNetHandle }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-pink-400/70 font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
              " ",
              citizen.firstName,
              " ",
              citizen.lastName
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 space-y-3 text-sm text-slate-300 font-mono", children: !analyzedIds.has(citizen.id) ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleAnalyzeProfile(citizen),
            disabled: analyzingId !== null,
            className: `w-full py-2 rounded font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${analyzingId === citizen.id ? "bg-pink-600 text-white cursor-wait" : analyzingId !== null ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-pink-900/20 hover:bg-pink-600 hover:text-white text-pink-400 border border-pink-500/30"}`,
            children: analyzingId === citizen.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
              " ANALIZOWANIE..."
            ] }) : "ANALIZUJ PROFIL"
          }
        ) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3 animate-in fade-in zoom-in duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-pink-900/30 pb-2", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-pink-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-slate-500", children: "Telefon" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-white ml-auto", children: citizen.phoneNumber })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-pink-900/30 pb-2", children: [
            /* @__PURE__ */ jsx(Car, { className: "w-4 h-4 text-pink-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-slate-500", children: "Pojazd" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-white ml-auto", children: citizen.vehicle || "Brak" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-pink-900/30 pb-2", children: [
            /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 text-pink-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-slate-500", children: "Wygl\u0105d" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-white ml-auto text-right", children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-[10px] text-pink-400", children: [
                "W\u0142osy: ",
                citizen.hairColor
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "block text-[10px] text-pink-400", children: [
                "Oczy: ",
                citizen.eyeColor
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-b border-pink-900/30 pb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-pink-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-slate-500", children: "Ostatnio w:" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap text-[9px] font-bold text-white pl-6", children: [
              citizen.favorites?.club && /* @__PURE__ */ jsx("span", { className: "bg-pink-900/50 px-2 py-1 rounded border border-pink-700/50", children: ["\uD83D\uDCCC ", citizen.favorites.club] }),
              citizen.favorites?.bar && /* @__PURE__ */ jsx("span", { className: "bg-pink-900/50 px-2 py-1 rounded border border-pink-700/50", children: ["\uD83D\uDCCC ", citizen.favorites.bar] }),
              citizen.favorites?.restaurant && /* @__PURE__ */ jsx("span", { className: "bg-pink-900/50 px-2 py-1 rounded border border-pink-700/50", children: ["\uD83D\uDCCC ", citizen.favorites.restaurant] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-2 text-[10px] text-pink-600 font-medium justify-end opacity-70", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(Hash, { className: "w-3 h-3" }),
              "photo"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(Hash, { className: "w-3 h-3" }),
              "life"
            ] })
          ] })
        ] }) }),
        showDownloadBtn && analyzedIds.has(citizen.id) && /* @__PURE__ */ jsx("div", { className: "p-3 bg-black/40 border-t border-pink-900/30 flex justify-end", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDownload(citizen),
            className: "text-[10px] bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors uppercase tracking-wider shadow-[0_0_10px_rgba(236,72,153,0.2)] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
              " ZAPISZ DANE"
            ]
          }
        ) })
      ] }, citizen.id)) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-pink-900/30", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-16 h-16 opacity-20 mb-4 animate-pulse" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-mono uppercase tracking-widest font-bold", children: "Wyszukaj profil InstaNet" })
      ] }) })
    ] })
  ] });
};
var stdin_default = InstaNet;
export {
  stdin_default as default
};
