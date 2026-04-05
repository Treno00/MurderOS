import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { GameState } from "../../../Scripts/App/GameState.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
import { FileText, User, CheckCircle, XCircle, Download } from "lucide-react";
import { dispatchAddNewVictimFile } from "../../../Scripts/App/events.js";
const PoliceInvestigations = () => {
  const { playerBalance, updateBalance } = useGame();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [linkedCitizen, setLinkedCitizen] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeReportWindow, setActiveReportWindow] = useState(null);
  const [reportVictimPesel, setReportVictimPesel] = useState("");
  const [reportVictimFirstName, setReportVictimFirstName] = useState("");
  const [reportVictimLastName, setReportVictimLastName] = useState("");
  const [reportVictimCity, setReportVictimCity] = useState("");
  const [reportVictimAddress, setReportVictimAddress] = useState("");
  const [reportVictimGps, setReportVictimGps] = useState("");
  const [reportSuspectPesel, setReportSuspectPesel] = useState("");
  const [reportSuspectFirstName, setReportSuspectFirstName] = useState("");
  const [reportSuspectLastName, setReportSuspectLastName] = useState("");
  const [reportSuspectCity, setReportSuspectCity] = useState("");
  const [reportSuspectAddress, setReportSuspectAddress] = useState("");
  const [reportSuspectHeight, setReportSuspectHeight] = useState("");
  const [reportSuspectWeight, setReportSuspectWeight] = useState("");
  const [reportSuspectHair, setReportSuspectHair] = useState("");
  const [reportSuspectEyes, setReportSuspectEyes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  useEffect(() => {
    const allCases = GameState.getPoliceCases();
    const activeCases = allCases.filter((c) => c.status !== "ROZWIĄZANE");
    setCases(activeCases);
  }, []);
  
  useEffect(() => {
    if (cases.length > 0 && (!selectedCase || !cases.find(c => c.id === selectedCase.id))) {
      setSelectedCase(cases[0]);
    } else if (cases.length === 0) {
      setSelectedCase(null);
    }
  }, [cases, selectedCase]);
  useEffect(() => {
    if (selectedCase) {
      const deceased = GameState.getDeceasedCitizens();
      let found = deceased.find((c) => c.pesel === selectedCase.victimPesel);
      if (!found) {
        found = GameState.getCitizens().find((c) => c.pesel === selectedCase.victimPesel);
      }
      setLinkedCitizen(found || null);
    } else {
      setLinkedCitizen(null);
    }
  }, [selectedCase]);
  const handleDownloadFile = () => {
    if (!linkedCitizen) {
      alert("B\u0142\u0105d: Nie mo\u017Cna odnale\u017A\u0107 pe\u0142nych akt osobowych ofiary.");
      return;
    }
    const victim = linkedCitizen;
    dispatchAddNewVictimFile({
      firstName: victim.firstName,
      lastName: victim.lastName,
      pesel: victim.pesel,
      birthDate: victim.birthDate,
      phoneNumber: victim.phoneNumber,
      city: victim.city,
      livingCity: victim.livingCity,
      workCity: victim.workCity,
      currentCity: victim.currentCity,
      registeredAddress: victim.address,
      livingAddress: victim.livingAddress,
      workAddress: victim.workAddress,
      currentAddress: victim.currentAddress,
      employment: victim.jobTitle,
      companyName: victim.companyName,
      income: victim.income.toFixed(2),
      netIncome: victim.netIncome.toFixed(2),
      accountBalance: victim.accountBalance.toFixed(2),
      bankName: victim.bankName,
      accountNumber: victim.bankAccount,
      vehicle: victim.vehicle,
      licensePlate: victim.licensePlate,
      height: victim.height.toString(),
      weight: victim.weight.toString(),
      hairColor: victim.hairColor,
      eyeColor: victim.eyeColor,
      bloodType: victim.bloodType,
      sentences: victim.sentences.join(", "),
      fines: victim.fines.join(", "),
      diseases: victim.diseases.join(", "),
      addictions: victim.addictions.join(", "),
      psychologicalProfile: victim.psychologicalProfile,
      routine: victim.routine
    });
    alert(`Pobrano akta sprawy: ${victim.firstName} ${victim.lastName}`);
  };
  const openReportModal = () => {
    if (!selectedCase) return;
    setReportVictimPesel(selectedCase.victimPesel);
    setReportVictimFirstName(selectedCase.victimName.split(" ")[0]);
    setReportVictimLastName(selectedCase.victimName.split(" ")[1] || "");
    setReportVictimCity(selectedCase.victimCity);
    setReportVictimAddress(selectedCase.victimDetails.address);
    const lastGps = linkedCitizen?.gpsLocations && linkedCitizen.gpsLocations.length > 0 ? linkedCitizen.gpsLocations[linkedCitizen.gpsLocations.length - 1] : "BRAK DANYCH";
    setReportVictimGps(lastGps);
    setReportSuspectPesel("");
    setReportSuspectFirstName("");
    setReportSuspectLastName("");
    setReportSuspectCity("");
    setReportSuspectAddress("");
    setReportSuspectHeight("");
    setReportSuspectWeight("");
    setReportSuspectHair("");
    setReportSuspectEyes("");
    setSubmissionResult(null);
    setShowReportModal(true);
  };

  const cheatFillSuspect = () => {
    if (linkedCitizen && linkedCitizen.kidnapperId) {
      const allPeople = GameState.getAllCitizens();
      const kidnapper = allPeople.find(c => c.id === linkedCitizen.kidnapperId);
      if (kidnapper) {
        setReportSuspectPesel(kidnapper.pesel);
        setReportSuspectFirstName(kidnapper.firstName);
        setReportSuspectLastName(kidnapper.lastName);
        setReportSuspectCity(kidnapper.city);
        setReportSuspectAddress(kidnapper.address);
        setReportSuspectHeight(kidnapper.height.toString());
        setReportSuspectWeight(kidnapper.weight.toString());
        setReportSuspectHair(kidnapper.hairColor);
        setReportSuspectEyes(kidnapper.eyeColor);
      }
    }
  };
  const handleSubmitReport = () => {
    setIsSubmitting(true);
    const allPeople = GameState.getAllCitizens();
    const cleanString = (str) => str.toLowerCase().trim().replace(/\s+/g, " ");
    const matchingSuspects = allPeople.filter((c) => {
      if (reportSuspectPesel && reportSuspectPesel.trim() !== "") {
        return c.pesel === reportSuspectPesel;
      }
      if (reportSuspectFirstName && reportSuspectLastName) {
        return cleanString(c.firstName) === cleanString(reportSuspectFirstName) && cleanString(c.lastName) === cleanString(reportSuspectLastName);
      }
      return false;
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setShowReportModal(false);
      const isCorrect = linkedCitizen && linkedCitizen.kidnapperId && matchingSuspects.some(s => s.id === linkedCitizen.kidnapperId);
      
      if (isCorrect) {
        setSubmissionResult("SUCCESS");
        setTimeout(() => {
            GameState.resolvePoliceCase(selectedCase.id);
            setCases(prev => prev.filter(c => c.id !== selectedCase.id));
            
            const event = new CustomEvent("CLOSE_VICTIM_FILE", { detail: { pesel: selectedCase.victimPesel } });
            window.dispatchEvent(event);
        }, 2000);
      } else {
        setSubmissionResult("FAILURE");
      }
    }, 1500);
  };
  
  const handleFrameSomeone = () => {
    if (playerBalance < 100000) {
      alert("BRAK ŚRODKÓW. Potrzebujesz 100,000 PLN.");
      return;
    }
    const allPeople = GameState.getAllCitizens();
    const cleanString = (str) => str.toLowerCase().trim().replace(/\s+/g, " ");
    const matchingSuspects = allPeople.filter((c) => {
      if (reportSuspectPesel && reportSuspectPesel.trim() !== "") return c.pesel === reportSuspectPesel;
      if (reportSuspectFirstName && reportSuspectLastName) {
        return cleanString(c.firstName) === cleanString(reportSuspectFirstName) && cleanString(c.lastName) === cleanString(reportSuspectLastName);
      }
      return false;
    });

    const matchingSuspect = matchingSuspects[0];
    if (!matchingSuspect) {
      alert("Nie znaleziono takiej osoby w bazie obywateli.");
      return;
    }

    const victim = linkedCitizen;
    if (!victim || matchingSuspect.id === victim.id || matchingSuspect.pesel === selectedCase.victimPesel) {
      alert("Nie możesz wrobić samej ofiary.");
      return;
    }

    if (matchingSuspect.city !== victim.city) {
      alert("Wybrana osoba musi pochodzić z tego samego miasta co ofiara.");
      return;
    }

    const depth1Ids = victim.connections.map((c) => c.personId);
    const depth2Ids = [];
    depth1Ids.forEach((id) => {
      const p = allPeople.find((c) => c.id === id);
      if (p) {
        p.connections.forEach((conn) => {
          if (conn.personId !== victim.id && !depth1Ids.includes(conn.personId)) {
            depth2Ids.push(conn.personId);
          }
        });
      }
    });

    const isConnection1 = depth1Ids.includes(matchingSuspect.id);
    const isConnection2 = depth2Ids.includes(matchingSuspect.id);
    const sameSchool = !!victim.schoolName && victim.schoolName !== "Brak" && matchingSuspect.schoolName === victim.schoolName;
    const sameWork = !!victim.companyName && victim.companyName !== "Brak" && matchingSuspect.companyName === victim.companyName;

    const sharesFavorite = (matchingSuspect.favorites?.club && matchingSuspect.favorites?.club === victim.favorites?.club) || 
                           (matchingSuspect.favorites?.bar && matchingSuspect.favorites?.bar === victim.favorites?.bar) ||
                           (matchingSuspect.favorites?.gym && matchingSuspect.favorites?.gym === victim.favorites?.gym) ||
                           (matchingSuspect.favorites?.restaurant && matchingSuspect.favorites?.restaurant === victim.favorites?.restaurant) ||
                           (matchingSuspect.favorites?.shop && matchingSuspect.favorites?.shop === victim.favorites?.shop);
    
    const worksAtFavorite = (matchingSuspect.companyName && victim.favorites?.club && matchingSuspect.companyName === victim.favorites?.club) || 
                            (matchingSuspect.companyName && victim.favorites?.bar && matchingSuspect.companyName === victim.favorites?.bar) ||
                            (matchingSuspect.companyName && victim.favorites?.gym && matchingSuspect.companyName === victim.favorites?.gym) ||
                            (matchingSuspect.companyName && victim.favorites?.restaurant && matchingSuspect.companyName === victim.favorites?.restaurant) ||
                            (matchingSuspect.companyName && victim.favorites?.shop && matchingSuspect.companyName === victim.favorites?.shop);

    const isConnected = isConnection1 || isConnection2 || sameSchool || sameWork || sharesFavorite || worksAtFavorite;

    if (!isConnected) {
      alert("Osoba musi być w jakiś sposób połączona z ofiarą (np. rodzina, znajomi, ta sama szkoła lub ulubione miejsce).");
      return;
    }

    updateBalance(-100000);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowReportModal(false);
      setSubmissionResult("SUCCESS");
      setTimeout(() => {
          GameState.resolvePoliceCase(selectedCase.id);
          setCases(prev => prev.filter(c => c.id !== selectedCase.id));
          const event = new CustomEvent("CLOSE_VICTIM_FILE", { detail: { pesel: selectedCase.victimPesel } });
          window.dispatchEvent(event);
      }, 2000);
    }, 1500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-red-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-red-500 flex items-center gap-2 border-b border-red-900/30 pb-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }),
        "AKTYWNE DOCHODZENIA"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar", children: [
        cases.map((c) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => {
              setSelectedCase(c);
              setSubmissionResult(null);
            },
            className: `p-3 rounded border cursor-pointer transition-colors ${selectedCase?.id === c.id ? "bg-red-900/20 border-red-500" : "bg-black border-agency-border hover:border-red-900/50"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-red-100 text-sm", children: c.victimName }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-red-900/50 text-red-200 px-1 rounded", children: "PRIORYTET" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-red-500/70 font-mono mt-1", children: [
                "ZNALEZIONO: ",
                c.victimCity
              ] })
            ]
          },
          c.id
        )),
        cases.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500 py-8 font-mono text-sm", children: "BRAK OTWARTYCH DOCHODZE\u0143" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden", children: [
      selectedCase ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-white uppercase", children: selectedCase.victimName }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-red-500", children: [
              "SPRAWA # ",
              selectedCase.id
            ] })
          ] }),
          linkedCitizen && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleDownloadFile,
              className: "flex items-center gap-2 text-red-400 hover:text-red-200 transition-colors border border-red-900/50 px-4 py-2 rounded bg-black text-xs font-bold",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                " POBIERZ PE\u0141NE AKTA"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-red-900/20", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-red-600 uppercase font-bold mb-1", children: "Miejsce Zdarzenia" }),
            /* @__PURE__ */ jsxs("span", { className: "text-white font-mono text-sm", children: [
              selectedCase.victimDetails.address,
              " (",
              selectedCase.victimCity,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-red-900/20", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-red-600 uppercase font-bold mb-1", children: "Status" }),
            /* @__PURE__ */ jsx("span", { className: "text-red-400 font-mono text-sm uppercase animate-pulse", children: "DOCHODZENIE W TOKU" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [
          /* @__PURE__ */ jsx("button", { 
             onClick: () => setActiveReportWindow('police'),
             className: "bg-black/60 hover:bg-red-900/20 border border-red-900/30 hover:border-red-500/50 p-4 rounded flex flex-col items-center justify-center transition-all group",
             children: /* @__PURE__ */ jsxs(Fragment, { children: [
                 /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8 text-red-500/50 group-hover:text-red-400 mb-2" }),
                 /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-300 uppercase tracking-widest", children: "Raport Policyjny" })
             ]})
          }),
          /* @__PURE__ */ jsx("button", { 
             onClick: () => setActiveReportWindow('autopsy'),
             className: "bg-black/60 hover:bg-red-900/20 border border-red-900/30 hover:border-red-500/50 p-4 rounded flex flex-col items-center justify-center transition-all group",
             children: /* @__PURE__ */ jsxs(Fragment, { children: [
                 /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8 text-red-500/50 group-hover:text-red-400 mb-2" }),
                 /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-300 uppercase tracking-widest", children: "Raport Sekcji Zw\u0142ok" })
             ]})
          }),
          /* @__PURE__ */ jsx("button", { 
             onClick: () => setActiveReportWindow('scene'),
             className: "bg-black/60 hover:bg-red-900/20 border border-red-900/30 hover:border-red-500/50 p-4 rounded flex flex-col items-center justify-center transition-all group",
             children: /* @__PURE__ */ jsxs(Fragment, { children: [
                 /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8 text-red-500/50 group-hover:text-red-400 mb-2" }),
                 /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center", children: "Raport Miejsca Zbrodni" })
             ]})
          })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-red-500 font-bold uppercase text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
            " Rozwi\u0105zanie Sprawy"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-red-950/10 border border-red-900/30 p-6 rounded flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-red-300/70 text-center max-w-md", children: "Je\u015Bli zebra\u0142e\u015B wystarczaj\u0105ce dowody i zidentyfikowa\u0142e\u015B sprawc\u0119, wype\u0142nij raport ko\u0144cowy." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: openReportModal,
                className: "bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded font-bold uppercase text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-105",
                children: "WYPE\u0141NIJ FORMULARZ ZG\u0141OSZENIOWY"
              }
            )
          ] }),
          submissionResult === "SUCCESS" && /* @__PURE__ */ jsxs("div", { className: "bg-green-950/20 border border-green-500/50 p-4 rounded flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 mt-4", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-500" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-green-400 font-bold uppercase", children: "Gratulacje" }),
              /* @__PURE__ */ jsx("p", { className: "text-green-600/70 text-xs", children: "Sprawca zosta\u0142 poprawnie zidentyfikowany. Jednostki zosta\u0142y wys\u0142ane." })
            ] })
          ] }),
          submissionResult === "FAILURE" && /* @__PURE__ */ jsxs("div", { className: "bg-red-950/20 border border-red-500/50 p-4 rounded flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 mt-4", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "w-8 h-8 text-red-500" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-red-400 font-bold uppercase", children: "B\u0142\u0105d Weryfikacji" }),
              /* @__PURE__ */ jsx("p", { className: "text-red-600/70 text-xs", children: "Dowody nie wskazuj\u0105 na t\u0119 osob\u0119 lub dane s\u0105 niekompletne." })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-24 h-24 mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest", children: "WYBIERZ SPRAW\u0118 Z LISTY" })
      ] }),
      activeReportWindow && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#0a0a0a] border border-slate-800 w-full max-w-2xl p-8 rounded shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh] custom-scrollbar relative", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveReportWindow(null), className: "absolute top-4 right-4 text-slate-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(XCircle, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "border-b border-slate-800 pb-4 mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-mono font-black text-slate-200 uppercase tracking-widest", children: activeReportWindow === 'police' ? "Raport Policyjny" : activeReportWindow === 'autopsy' ? "Raport Sekcji Zw\u0142ok" : "Raport Miejsca Zbrodni" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1", children: `SYGNATURA AKT: ${selectedCase.id}` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap", children: 
            activeReportWindow === 'police' ? selectedCase.policeReportContent : 
            activeReportWindow === 'autopsy' ? selectedCase.autopsyReport : 
            selectedCase.sceneTraces.map(t => `- ${t}`).join('\n')
        })
      ] }) }),
      showReportModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-red-900/50 w-full max-w-3xl p-6 rounded shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-black text-red-500 mb-6 flex items-center gap-2 uppercase tracking-wider border-b border-red-900/30 pb-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }),
          " Raport Ko\u0144cowy Dochodzenia"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-blue-400 uppercase border-b border-blue-900/30 pb-1", children: "Dane Ofiary" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "PESEL" }),
                /* @__PURE__ */ jsx("input", { disabled: true, className: "w-full bg-black/50 border border-blue-900/20 p-2 rounded text-slate-400 font-mono text-xs", value: reportVictimPesel })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Imi\u0119 i Nazwisko" }),
                /* @__PURE__ */ jsx("input", { disabled: true, className: "w-full bg-black/50 border border-blue-900/20 p-2 rounded text-slate-400 font-mono text-xs", value: `${reportVictimFirstName} ${reportVictimLastName}` })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Miasto" }),
                  /* @__PURE__ */ jsx("input", { disabled: true, className: "w-full bg-black/50 border border-blue-900/20 p-2 rounded text-slate-400 font-mono text-xs", value: reportVictimCity })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Adres" }),
                  /* @__PURE__ */ jsx("input", { disabled: true, className: "w-full bg-black/50 border border-blue-900/20 p-2 rounded text-slate-400 font-mono text-xs", value: reportVictimAddress })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "GPS (Ostatni sygna\u0142)" }),
                /* @__PURE__ */ jsx("input", { disabled: true, className: "w-full bg-black/50 border border-blue-900/20 p-2 rounded text-slate-400 font-mono text-xs", value: reportVictimGps })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-red-900/30 pb-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-red-500 uppercase", children: "Dane Oprawcy" }),
                /* @__PURE__ */ jsx("button", { onClick: cheatFillSuspect, className: "bg-red-900/50 hover:bg-red-500 text-[9px] px-2 py-0.5 rounded text-white transition-colors", children: "[Cheat]" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "PESEL" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-red-900/30 p-2 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                    value: reportSuspectPesel,
                    onChange: (e) => setReportSuspectPesel(e.target.value),
                    placeholder: "Wpisz PESEL..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Imi\u0119" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-2 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      value: reportSuspectFirstName,
                      onChange: (e) => setReportSuspectFirstName(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Nazwisko" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-2 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      value: reportSuspectLastName,
                      onChange: (e) => setReportSuspectLastName(e.target.value)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Miasto Zamieszkania" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-2 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      value: reportSuspectCity,
                      onChange: (e) => setReportSuspectCity(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold block", children: "Adres Zamieszkania" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-2 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      value: reportSuspectAddress,
                      onChange: (e) => setReportSuspectAddress(e.target.value)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-red-500/70 uppercase font-bold block mb-1", children: "Metryka" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-1 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      placeholder: "Wzrost",
                      value: reportSuspectHeight,
                      onChange: (e) => setReportSuspectHeight(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-1 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      placeholder: "Waga",
                      value: reportSuspectWeight,
                      onChange: (e) => setReportSuspectWeight(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-1 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      placeholder: "W\u0142osy",
                      value: reportSuspectHair,
                      onChange: (e) => setReportSuspectHair(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-red-900/30 p-1 rounded text-red-100 focus:border-red-500 outline-none font-mono text-xs",
                      placeholder: "Oczy",
                      value: reportSuspectEyes,
                      onChange: (e) => setReportSuspectEyes(e.target.value)
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4 border-t border-agency-border", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowReportModal(false),
              className: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded text-xs font-bold transition-colors",
              children: "ANULUJ"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleFrameSomeone,
              disabled: isSubmitting,
              className: "flex-1 bg-red-900 hover:bg-red-800 text-white py-3 rounded text-xs font-bold transition-colors shadow-lg shadow-red-900/20",
              children: isSubmitting ? "WERYFIKACJA..." : "WROB W MORDERSTWO (100,000 PLN)"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSubmitReport,
              disabled: isSubmitting,
              className: "flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded text-xs font-bold transition-colors shadow-lg shadow-red-900/20",
              children: isSubmitting ? "WERYFIKACJA..." : "PRZE\u015ALIJ RAPORT"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
};
var stdin_default = PoliceInvestigations;
export {
  stdin_default as default
};
