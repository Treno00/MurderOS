import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { usePoliceWanted } from "../../../Scripts/Intel/LawEnforcement/usePoliceWanted.js";
const PoliceWanted = () => {
  const {
    wantedPersons,
    handleSendData,
    isAllSegmentsComplete
  } = usePoliceWanted();
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    if (wantedPersons.length > 0 && (!selectedPerson || !wantedPersons.find(p => p.id === selectedPerson.id))) {
      setSelectedPerson(wantedPersons[0]);
    } else if (wantedPersons.length === 0) {
      setSelectedPerson(null);
    }
  }, [wantedPersons, selectedPerson]);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-red-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-red-900/30 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-red-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5" }),
        "LISTY GO\u0143CZE"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar", children: [
        wantedPersons.map((p) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedPerson(p),
            className: `p-3 rounded border cursor-pointer transition-colors relative overflow-hidden ${selectedPerson?.id === p.id ? "bg-red-900/20 border-red-500" : "bg-black border-agency-border hover:border-red-900/50"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded-bl", children: "WANTED" }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mt-2", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-100 text-sm", children: [
                p.firstName,
                " ",
                p.lastName
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-red-500/70 font-mono mt-1", children: p.reward && /* @__PURE__ */ jsxs("span", { className: "block font-bold", children: [
                "NAGRODA: ",
                p.reward.toLocaleString(),
                " PLN"
              ] }) })
            ]
          },
          p.id
        )),
        wantedPersons.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500 py-8 font-mono text-sm", children: "BRAK AKTYWNYCH LIST\xD3W GO\u0143CZYCH" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden", children: selectedPerson ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-black text-white uppercase", children: [
          selectedPerson.firstName,
          " ",
          selectedPerson.lastName
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-red-500", children: [
          "POSZUKIWANY # ",
          selectedPerson.id.slice(0, 8).toUpperCase()
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-red-900/20", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-red-600 uppercase font-bold mb-1", children: "Zarzuty" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-mono text-sm", children: selectedPerson.sentences.join(", ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-red-900/20", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-red-600 uppercase font-bold mb-1", children: "Status" }),
          /* @__PURE__ */ jsx("span", { className: "text-red-400 font-mono text-sm uppercase animate-pulse", children: "POSZUKIWANY" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col gap-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-950/10 border border-red-900/30 p-4 rounded flex items-center justify-between mt-auto", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-red-600 uppercase font-bold", children: "Wymagane Dzia\u0142ania" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: "Uzupe\u0142nij akta sprawy, aby przes\u0142a\u0107 raport." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSendData(selectedPerson),
            disabled: !isAllSegmentsComplete,
            className: `px-6 py-2 rounded font-bold uppercase text-xs transition-colors ${isAllSegmentsComplete ? "bg-red-600 hover:bg-red-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`,
            children: "Prze\u015Blij Dane"
          }
        )
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "w-24 h-24 mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest", children: "WYBIERZ OSOB\u0118 Z LISTY" })
    ] }) })
  ] });
};
var stdin_default = PoliceWanted;
export {
  stdin_default as default
};
