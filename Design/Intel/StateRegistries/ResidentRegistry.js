import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Search, Building2, MapPin, Download, Database, User, Users, FileDigit } from "lucide-react";
import { GameState } from "../../../Scripts/App/GameState.js";
import { dispatchDataTransfer } from "../../../Scripts/App/events.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
const ResidentRegistry = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [address, setAddress] = useState(getAutofill(activeFile?.registeredAddress));
  const [pesel, setPesel] = useState(getAutofill(activeFile?.pesel));
  const results = useMemo(() => {
    if (!firstName && !lastName && !city && !address && !pesel) return [];
    return db.filter((p) => {
      const matchFirst = firstName ? p.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? p.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchCity = city ? p.city.toLowerCase().includes(city.toLowerCase()) : true;
      const matchAddress = address ? p.address.toLowerCase().includes(address.toLowerCase()) : true;
      const matchPesel = pesel ? p.pesel.startsWith(pesel) : true;
      return matchFirst && matchLast && matchCity && matchAddress && matchPesel;
    });
  }, [db, firstName, lastName, city, address, pesel]);
  const getLivesWith = (person) => {
    if (person.jobTitle.startsWith("Ucze\u0144")) {
      return "Rodzice";
    }
    const status = person.relationshipStatus;
    if (["\u017Bonaty", "Zam\u0119\u017Cna"].includes(status)) {
      return "Ma\u0142\u017Conek";
    }
    if (["W zwi\u0105zku", "Narzeczony", "Narzeczona"].includes(status)) {
      return "Partner";
    }
    return "Samotnie";
  };
  const handleDownload = (person) => {
    dispatchDataTransfer({
      firstName: person.firstName,
      lastName: person.lastName,
      pesel: person.pesel,
      birthDate: person.birthDate,
      maritalStatus: person.relationshipStatus,
      city: person.city,
      registeredAddress: person.address,
      livesWith: getLivesWith(person)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex gap-4 text-slate-200 p-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 bg-agency-dark border border-orange-900/50 rounded flex flex-col overflow-hidden shadow-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-orange-950/20 border-b border-orange-900/30 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-orange-500/10 rounded border border-orange-500/20", children: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5 text-orange-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-bold text-orange-100 tracking-wider text-sm", children: "REJESTR PESEL" }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-orange-500/70 font-mono", children: "MSWiA DATABASE ACCESS" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "PESEL" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FileDigit, { className: "absolute left-2 top-2 w-3 h-3 text-orange-500/50" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 pl-7 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-sm",
                placeholder: "Wyszukaj po numerze...",
                value: pesel,
                onChange: (e) => setPesel(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-orange-900/20 my-2" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-sm",
              placeholder: "Jan",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-sm",
              placeholder: "Kowalski",
              value: lastName,
              onChange: (e) => setLastName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Miasto Zameldowania" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-sm",
              placeholder: "Warszawa",
              value: city,
              onChange: (e) => setCity(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Adres Zameldowania (Ulica)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-sm",
              placeholder: "ul. G\u0142\xF3wna",
              value: address,
              onChange: (e) => setAddress(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 p-3 bg-orange-900/10 border border-orange-900/20 rounded text-[10px] text-orange-300 font-mono", children: [
          /* @__PURE__ */ jsx(Database, { className: "w-3 h-3 mb-2 inline-block mr-2" }),
          "Dost\u0119p monitorowany. Wszelkie zapytania s\u0105 logowane."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(Building2, { className: "w-64 h-64 text-orange-500" }) }),
      /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-agency-border bg-black/40 z-10 flex justify-between items-center", children: /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-orange-500", children: [
        "WYNIKI: ",
        results.length
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3 z-10 custom-scrollbar", children: !firstName && !lastName && !city && !address && !pesel ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-700 opacity-50", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-12 h-12 mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-widest text-xs", children: "Oczekiwanie..." })
      ] }) : results.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-700 opacity-50", children: [
        /* @__PURE__ */ jsx(User, { className: "w-12 h-12 mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-widest text-xs", children: "Brak wynik\xF3w" })
      ] }) : results.map((person) => /* @__PURE__ */ jsxs("div", { className: "bg-black/60 border border-agency-border hover:border-orange-500/50 transition-colors rounded p-3 flex justify-between items-center group", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-white", children: [
              person.lastName.toUpperCase(),
              ", ",
              person.firstName
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-orange-950/30 text-orange-400 px-2 py-0.5 rounded border border-orange-900/30 font-mono", children: person.pesel })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
            person.address,
            ", ",
            person.city
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-[10px] text-slate-500 font-mono mt-1", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "UR: ",
              /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: person.birthDate })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
              " Mieszka: ",
              /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: getLivesWith(person) })
            ] })
          ] })
        ] }),
        settings.showDownloadBtn && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDownload(person),
            className: "flex flex-col items-center gap-1 text-slate-600 hover:text-orange-400 transition-colors group-hover:scale-105",
            title: "Pobierz odpis do akt",
            children: /* @__PURE__ */ jsx("div", { className: "p-2 bg-agency-dark rounded-full border border-agency-border group-hover:border-orange-500", children: /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }) })
          }
        )
      ] }, person.id)) })
    ] })
  ] });
};
var stdin_default = ResidentRegistry;
export {
  stdin_default as default
};
