import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, X, User, Users, Activity, CreditCard, MapPin, Scale, ChevronLeft, ChevronRight, Unlock, Calendar, FileText, Clipboard, ChevronDown, ChevronUp, Clock, Briefcase, Fingerprint, Home, AlertCircle, Stethoscope, Church, Moon, FolderOpen, CheckCircle, GraduationCap } from "lucide-react";
import { useVictimFilePanel } from "../../Scripts/App/useVictimFilePanel.js";
const InputField = ({ label, value, onChange, placeholder = "---", className = "", borderColor, maxLength }) => {
  const borderClass = borderColor || "border-slate-800 focus:border-agency-main";
  const textClass = "text-slate-300 focus:text-white";
  return /* @__PURE__ */ jsxs("div", { className: `mb-3 ${className}`, children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        onBlur: () => onChange(value.trim()),
        placeholder,
        maxLength,
        className: `w-full bg-black border ${borderClass} rounded p-1.5 text-xs ${textClass} outline-none transition-colors font-mono placeholder:text-slate-800`
      }
    )
  ] });
};
const TextAreaField = ({ label, value, onChange, rows = 3 }) => /* @__PURE__ */ jsxs("div", { className: "mb-3 h-full flex flex-col", children: [
  /* @__PURE__ */ jsx("label", { className: "block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1", children: label }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      value,
      onChange: (e) => onChange(e.target.value),
      rows,
      className: "w-full flex-1 bg-black border border-slate-800 rounded p-2 text-xs text-slate-300 outline-none focus:border-agency-main focus:text-white transition-colors font-mono resize-none"
    }
  )
] });
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false, isComplete = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: `border rounded mb-3 overflow-hidden transition-colors ${isComplete ? "border-green-900/50 bg-green-950/10" : "border-slate-800 bg-black/40"}`, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: `w-full flex items-center justify-between p-2 transition-colors ${isComplete ? "bg-green-900/20 hover:bg-green-900/30" : "bg-slate-900/50 hover:bg-slate-800"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isComplete ? "text-green-500" : "text-agency-main"}`, children: [
            /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-widest ${isComplete ? "text-green-400" : "text-slate-300"}`, children: title }),
            isComplete && /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 text-green-500 ml-2" })
          ] }),
          isOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-3 h-3 text-slate-600" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 text-slate-600" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: `p-3 border-t ${isComplete ? "border-green-900/30" : "border-slate-800 bg-black"}`, children })
  ] });
};
const VictimFilePanel = () => {
  const {
    isVictimPanelOpen,
    toggleVictimPanel,
    activeVictim,
    activeTabId,
    setActiveTabId,
    activeSubTab,
    setActiveSubTab,
    scheduleDay,
    setScheduleDay,
    victims,
    addVictim,
    removeVictim,
    updateVictim,
    getValidationColor,
    getFamilyFieldColor,
    checkSectionComplete,
    handleUnlockAll
  } = useVictimFilePanel();
  const getIcon = (type) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      case "commute":
        return MapPin;
      case "shopping":
        return CreditCard;
      case "leisure":
        return AlertCircle;
      case "health":
        return Stethoscope;
      case "worship":
        return Church;
      case "sleep":
        return Moon;
      default:
        return User;
    }
  };
  const fieldsPersonal = ["pesel", "firstName", "lastName", "birthDate", "maritalStatus", "phoneNumber"];
  const fieldsEducation = ["education", "schoolName", "schoolAddress", "mainExamTitle", "mainExamYear", "mainExamGrade", "extraExamTitle", "extraExamYear", "extraExamGrade"];
  const fieldsLocation = ["city", "registeredAddress", "livesWith", "livingCity", "livingAddress", "employment", "companyName", "workCity", "workAddress", "currentCity", "currentAddress"];
  const fieldsFinance = ["accountNumber", "bankName", "vehicle", "licensePlate", "cardNumber", "cardExpiry", "cardCVV", "accountBalance", "income", "netIncome"];
  const fieldsBiometrics = ["height", "weight", "hairColor", "eyeColor"];
  const fieldsCriminal = ["sentences", "fines"];
  const fieldsMedical = ["insuranceNumber", "bloodType", "bmi", "diseases", "addictions", "psychologicalProfile"];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
        border-l border-slate-800 shadow-2xl transition-all duration-300 bg-black flex flex-col relative z-50
        ${isVictimPanelOpen ? "w-[450px]" : "w-0"}
      `,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleVictimPanel,
            className: "absolute -left-5 top-1/2 -translate-y-1/2 bg-agency-panel border border-agency-border border-r-0 rounded-l w-5 h-12 flex items-center justify-center text-agency-text hover:text-white hover:bg-agency-main hover:border-agency-main transition-all z-50 shadow-lg cursor-pointer",
            children: isVictimPanelOpen ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden flex-1 flex flex-col h-full w-[450px] bg-black", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-hide shrink-0", children: [
            victims.map((victim) => /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => setActiveTabId(victim.id),
                className: `
                  group flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase cursor-pointer min-w-[140px] border-r border-slate-800 transition-colors
                  ${activeTabId === victim.id ? "bg-black text-agency-main border-t-2 border-t-agency-main" : "text-slate-600 hover:text-slate-400 bg-slate-950 border-t-2 border-t-transparent"}
                `,
                children: [
                  /* @__PURE__ */ jsx("span", { className: `truncate max-w-[90px] ${victim.isDead ? "text-red-600 line-through" : ""}`, children: victim.lastName || "NOWE AKTA" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => removeVictim(e, victim.id),
                      className: "opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-2",
                      children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              victim.id
            )),
            /* @__PURE__ */ jsx("button", { onClick: addVictim, className: "px-3 py-2 text-slate-600 hover:text-agency-success hover:bg-slate-900 transition-colors border-r border-slate-800", children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }) })
          ] }),
          !activeVictim ? (
            // EMPTY STATE
            /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-600 bg-black animate-in fade-in zoom-in duration-300", children: [
              /* @__PURE__ */ jsx("div", { className: "p-6 bg-slate-900/50 rounded-full mb-6 border border-slate-800", children: /* @__PURE__ */ jsx(FolderOpen, { className: "w-16 h-16 text-slate-700" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold uppercase tracking-widest text-slate-500 mb-2", children: "Brak Otwartych Akt" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-slate-600 mb-8 max-w-[200px]", children: "Nie masz aktualnie otwartych \u017Cadnych teczek operacyjnych." }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: addVictim,
                  className: "flex items-center gap-2 bg-agency-main/10 hover:bg-agency-main/20 border border-agency-main/50 text-agency-main px-6 py-3 rounded font-bold uppercase text-xs tracking-wider transition-all hover:scale-105 shadow-[0_0_15px_rgba(14,165,233,0.1)]",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                    " Stw\xF3rz Now\u0105 Kart\u0119"
                  ]
                }
              )
            ] })
          ) : (
            // CONTENT STATE
            /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex border-b border-slate-800 bg-slate-950 shrink-0", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActiveSubTab("files"),
                    className: `flex-1 py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors ${activeSubTab === "files" ? "text-white bg-slate-900 border-b-2 border-agency-main" : "text-slate-600 border-b-2 border-transparent"}`,
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-3 h-3" }),
                      " Akta"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActiveSubTab("schedule"),
                    className: `flex-1 py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors ${activeSubTab === "schedule" ? "text-white bg-slate-900 border-b-2 border-agency-main" : "text-slate-600 border-b-2 border-transparent"}`,
                    children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                      " Harmonogram"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActiveSubTab("notes"),
                    className: `flex-1 py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors ${activeSubTab === "notes" ? "text-white bg-slate-900 border-b-2 border-agency-main" : "text-slate-600 border-b-2 border-transparent"}`,
                    children: [
                      /* @__PURE__ */ jsx(Clipboard, { className: "w-3 h-3" }),
                      " Notatki"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 custom-scrollbar bg-black", children: [
                activeSubTab === "files" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-right-2 duration-300", children: [
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Dane Osobowe",
                      icon: User,
                      defaultOpen: true,
                      isComplete: checkSectionComplete(fieldsPersonal),
                      children: [
                        /* @__PURE__ */ jsx(InputField, { label: "PESEL", value: activeVictim.pesel, onChange: (v) => updateVictim("pesel", v), borderColor: getValidationColor("pesel") }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Imi\u0119", value: activeVictim.firstName, onChange: (v) => updateVictim("firstName", v), borderColor: getValidationColor("firstName") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Nazwisko", value: activeVictim.lastName, onChange: (v) => updateVictim("lastName", v), borderColor: getValidationColor("lastName") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Data Urodzenia", placeholder: "DD.MM.RRRR", value: activeVictim.birthDate, onChange: (v) => updateVictim("birthDate", v), borderColor: getValidationColor("birthDate") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Stan Cywilny", value: activeVictim.maritalStatus, onChange: (v) => updateVictim("maritalStatus", v), borderColor: getValidationColor("maritalStatus") })
                        ] }),
                        /* @__PURE__ */ jsx(InputField, { label: "Numer Telefonu", value: activeVictim.phoneNumber, onChange: (v) => updateVictim("phoneNumber", v), borderColor: getValidationColor("phoneNumber") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Edukacja",
                      icon: GraduationCap,
                      isComplete: checkSectionComplete(fieldsEducation),
                      children: [
                        /* @__PURE__ */ jsx(InputField, { label: "Wykszta\u0142cenie", value: activeVictim.education, onChange: (v) => updateVictim("education", v), borderColor: getValidationColor("education") }),
                        /* @__PURE__ */ jsx(InputField, { label: "Nazwa Szko\u0142y / Uczelni", value: activeVictim.schoolName, onChange: (v) => updateVictim("schoolName", v), borderColor: getValidationColor("schoolName") }),
                        /* @__PURE__ */ jsx(InputField, { label: "Adres Plac\xF3wki", value: activeVictim.schoolAddress, onChange: (v) => updateVictim("schoolAddress", v), borderColor: getValidationColor("schoolAddress") }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-3 border-t border-slate-800 pt-3", children: [
                          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-slate-500 uppercase font-bold mb-2", children: "Egzamin G\u0142\xF3wny" }),
                          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_80px_80px] gap-2", children: [
                            /* @__PURE__ */ jsx(InputField, { label: "Egzamin", value: activeVictim.mainExamTitle, onChange: (v) => updateVictim("mainExamTitle", v), borderColor: getValidationColor("mainExamTitle"), placeholder: "Typ" }),
                            /* @__PURE__ */ jsx(InputField, { label: "Rok", value: activeVictim.mainExamYear, onChange: (v) => updateVictim("mainExamYear", v), borderColor: getValidationColor("mainExamYear"), placeholder: "RRRR" }),
                            /* @__PURE__ */ jsx(InputField, { label: "Ocena", value: activeVictim.mainExamGrade, onChange: (v) => updateVictim("mainExamGrade", v), borderColor: getValidationColor("mainExamGrade"), placeholder: "Wynik" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1 border-t border-slate-800 pt-2", children: [
                          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-slate-500 uppercase font-bold mb-2", children: "Egzamin Dodatkowy" }),
                          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_80px_80px] gap-2", children: [
                            /* @__PURE__ */ jsx(InputField, { label: "Egzamin", value: activeVictim.extraExamTitle, onChange: (v) => updateVictim("extraExamTitle", v), borderColor: getValidationColor("extraExamTitle"), placeholder: "Typ" }),
                            /* @__PURE__ */ jsx(InputField, { label: "Rok", value: activeVictim.extraExamYear, onChange: (v) => updateVictim("extraExamYear", v), borderColor: getValidationColor("extraExamYear"), placeholder: "RRRR" }),
                            /* @__PURE__ */ jsx(InputField, { label: "Ocena", value: activeVictim.extraExamGrade, onChange: (v) => updateVictim("extraExamGrade", v), borderColor: getValidationColor("extraExamGrade"), placeholder: "Wynik" })
                          ] })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Lokalizacja",
                      icon: MapPin,
                      isComplete: checkSectionComplete(["city", "registeredAddress", "currentCity", "currentAddress", "livesWith", "livingCity", "livingAddress"]),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_2fr] gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Miasto Zameldowania", value: activeVictim.city, onChange: (v) => updateVictim("city", v), borderColor: getValidationColor("city") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Adres Zameldowania", value: activeVictim.registeredAddress, onChange: (v) => updateVictim("registeredAddress", v), borderColor: getValidationColor("registeredAddress") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_2fr] gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Miasto Zamieszkania", value: activeVictim.livingCity, onChange: (v) => updateVictim("livingCity", v), borderColor: getValidationColor("livingCity") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Adres Zamieszkania", value: activeVictim.livingAddress, onChange: (v) => updateVictim("livingAddress", v), borderColor: getValidationColor("livingAddress") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_2fr] gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Aktualne Miasto", value: activeVictim.currentCity, onChange: (v) => updateVictim("currentCity", v), borderColor: getValidationColor("currentCity") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Aktualny Adres", value: activeVictim.currentAddress, onChange: (v) => updateVictim("currentAddress", v), borderColor: getValidationColor("currentAddress") })
                        ] }),
                        /* @__PURE__ */ jsx(InputField, { label: "Mieszka z", value: activeVictim.livesWith, onChange: (v) => updateVictim("livesWith", v), borderColor: getValidationColor("livesWith") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Rodzina / Powi\u0105zania",
                      icon: Users,
                      isComplete: checkSectionComplete(["familyMembers"]),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                          activeVictim.familyMembers && activeVictim.familyMembers.length > 0 && activeVictim.familyMembers.map((member, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/50 p-2 border border-slate-800 rounded flex gap-2 items-center", children: [
                            /* @__PURE__ */ jsxs(
                              "select",
                              {
                                value: member.relation,
                                onChange: (e) => {
                                  const newFamily = [...activeVictim.familyMembers];
                                  newFamily[idx].relation = e.target.value;
                                  updateVictim("familyMembers", newFamily);
                                },
                                className: `bg-black border ${getFamilyFieldColor(idx, "relation") || "border-slate-800 focus:border-agency-main"} text-xs text-slate-300 p-1.5 rounded outline-none w-[100px]`,
                                children: [
                                  /* @__PURE__ */ jsx("option", { value: "", children: "Relacja" }),
                                  /* @__PURE__ */ jsx("option", { value: "Narzecze\u0144stwo", children: "Narzecze\u0144stwo" }),
                                  /* @__PURE__ */ jsx("option", { value: "Partner", children: "Partner" }),
                                  /* @__PURE__ */ jsx("option", { value: "Rodzina", children: "Rodzina" }),
                                  /* @__PURE__ */ jsx("option", { value: "Przyjaciel", children: "Przyjaciel" }),
                                  /* @__PURE__ */ jsx("option", { value: "Wsp\xF3\u0142pracownik", children: "Wsp\xF3\u0142pracownik" }),
                                  /* @__PURE__ */ jsx("option", { value: "Inne", children: "Inne" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                placeholder: "Imi\u0119",
                                value: member.firstName,
                                onChange: (e) => {
                                  const newFamily = [...activeVictim.familyMembers];
                                  newFamily[idx].firstName = e.target.value;
                                  updateVictim("familyMembers", newFamily);
                                },
                                className: `bg-black border ${getFamilyFieldColor(idx, "firstName") || "border-slate-800 focus:border-agency-main"} text-xs text-slate-300 p-1.5 rounded outline-none flex-1 font-mono`
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                placeholder: "Nazwisko",
                                value: member.lastName,
                                onChange: (e) => {
                                  const newFamily = [...activeVictim.familyMembers];
                                  newFamily[idx].lastName = e.target.value;
                                  updateVictim("familyMembers", newFamily);
                                },
                                className: `bg-black border ${getFamilyFieldColor(idx, "lastName") || "border-slate-800 focus:border-agency-main"} text-xs text-slate-300 p-1.5 rounded outline-none flex-1 font-mono`
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                onClick: () => {
                                  const newFamily = activeVictim.familyMembers.filter((_, i) => i !== idx);
                                  updateVictim("familyMembers", newFamily);
                                },
                                className: "bg-red-900/20 hover:bg-red-900/50 text-red-500 hover:text-red-400 transition-colors px-2 py-1.5 flex items-center justify-center rounded border border-red-900/30",
                                title: "Usu\u0144 powi\u0105zanie",
                                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                              }
                            )
                          ] }, idx)),
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              onClick: () => {
                                const newFamily = [...activeVictim.familyMembers || [], { relation: "", firstName: "", lastName: "" }];
                                updateVictim("familyMembers", newFamily);
                              },
                              className: "w-full text-[10px] text-slate-500 hover:text-agency-main font-bold uppercase tracking-wider py-2 border border-dashed border-slate-800 hover:border-agency-main rounded flex justify-center items-center gap-1 transition-colors",
                              children: [
                                /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                                " Dodaj powi\u0105zanie"
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Praca",
                      icon: Briefcase,
                      isComplete: checkSectionComplete(["employment", "companyName", "workCity", "workAddress", "income", "netIncome"]),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Firma", value: activeVictim.companyName, onChange: (v) => updateVictim("companyName", v), borderColor: getValidationColor("companyName") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Zatrudnienie", value: activeVictim.employment, onChange: (v) => updateVictim("employment", v), borderColor: getValidationColor("employment") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_2fr] gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Miasto", value: activeVictim.workCity, onChange: (v) => updateVictim("workCity", v), borderColor: getValidationColor("workCity") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Adres Pracy", value: activeVictim.workAddress, onChange: (v) => updateVictim("workAddress", v), borderColor: getValidationColor("workAddress") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Brutto (Rejestr podatkowy)", value: activeVictim.income, onChange: (v) => updateVictim("income", v), borderColor: getValidationColor("income") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Netto (Wynagrodzenie)", value: activeVictim.netIncome, onChange: (v) => updateVictim("netIncome", v), borderColor: getValidationColor("netIncome") })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Dane Finansowe",
                      icon: CreditCard,
                      isComplete: checkSectionComplete(["bankName", "accountNumber", "cardNumber", "cardExpiry", "cardCVV", "accountBalance", "vehicle"]),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[2fr_1fr] gap-3 mb-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Nazwa Banku", value: activeVictim.bankName, onChange: (v) => updateVictim("bankName", v), borderColor: getValidationColor("bankName") }),
                          /* @__PURE__ */ jsx(InputField, { label: "ID Klienta Banku", value: activeVictim.bankClientId, onChange: (v) => updateVictim("bankClientId", v), borderColor: getValidationColor("bankClientId") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[3fr_2fr] gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Numer Konta", value: activeVictim.accountNumber, onChange: (v) => updateVictim("accountNumber", v), borderColor: getValidationColor("accountNumber") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Stan Konta", value: activeVictim.accountBalance, onChange: (v) => updateVictim("accountBalance", v), borderColor: getValidationColor("accountBalance") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_80px_60px] gap-2", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Nr Karty", value: activeVictim.cardNumber, onChange: (v) => updateVictim("cardNumber", v), borderColor: getValidationColor("cardNumber") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Wa\u017Cno\u015B\u0107", value: activeVictim.cardExpiry, onChange: (v) => updateVictim("cardExpiry", v), borderColor: getValidationColor("cardExpiry") }),
                          /* @__PURE__ */ jsx(InputField, { label: "CVV", value: activeVictim.cardCVV, onChange: (v) => updateVictim("cardCVV", v), borderColor: getValidationColor("cardCVV"), maxLength: 3 })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Pojazd", value: activeVictim.vehicle, onChange: (v) => updateVictim("vehicle", v), borderColor: getValidationColor("vehicle") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Rejestracja", value: activeVictim.licensePlate, onChange: (v) => updateVictim("licensePlate", v), borderColor: getValidationColor("licensePlate") })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Biometria",
                      icon: Fingerprint,
                      isComplete: checkSectionComplete(fieldsBiometrics),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Wzrost (cm)", value: activeVictim.height, onChange: (v) => updateVictim("height", v), borderColor: getValidationColor("height") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Waga (kg)", value: activeVictim.weight, onChange: (v) => updateVictim("weight", v), borderColor: getValidationColor("weight") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Kolor W\u0142os\xF3w", value: activeVictim.hairColor, onChange: (v) => updateVictim("hairColor", v), borderColor: getValidationColor("hairColor") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Kolor Oczu", value: activeVictim.eyeColor, onChange: (v) => updateVictim("eyeColor", v), borderColor: getValidationColor("eyeColor") })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Kartoteka",
                      icon: Scale,
                      isComplete: checkSectionComplete(fieldsCriminal),
                      children: [
                        /* @__PURE__ */ jsx(InputField, { label: "Wyroki", value: activeVictim.sentences, onChange: (v) => updateVictim("sentences", v), placeholder: "---", borderColor: getValidationColor("sentences") }),
                        /* @__PURE__ */ jsx(InputField, { label: "Grzywny", value: activeVictim.fines, onChange: (v) => updateVictim("fines", v), placeholder: "---", borderColor: getValidationColor("fines") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    CollapsibleSection,
                    {
                      title: "Raport Medyczny",
                      icon: Activity,
                      isComplete: checkSectionComplete(fieldsMedical),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Nr Ubezpieczenia", value: activeVictim.insuranceNumber, onChange: (v) => updateVictim("insuranceNumber", v), borderColor: getValidationColor("insuranceNumber") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Grupa Krwi", value: activeVictim.bloodType, onChange: (v) => updateVictim("bloodType", v), borderColor: getValidationColor("bloodType") }),
                          /* @__PURE__ */ jsx(InputField, { label: "BMI", value: activeVictim.bmi, onChange: (v) => updateVictim("bmi", v), borderColor: getValidationColor("bmi") })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-3", children: [
                          /* @__PURE__ */ jsx(InputField, { label: "Choroby", value: activeVictim.diseases, onChange: (v) => updateVictim("diseases", v), borderColor: getValidationColor("diseases") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Uzale\u017Cnienia", value: activeVictim.addictions, onChange: (v) => updateVictim("addictions", v), borderColor: getValidationColor("addictions") }),
                          /* @__PURE__ */ jsx(InputField, { label: "Profil Psychologiczny", value: activeVictim.psychologicalProfile, onChange: (v) => updateVictim("psychologicalProfile", v), borderColor: getValidationColor("psychologicalProfile") })
                        ] })
                      ]
                    }
                  ),
                  activeVictim.pesel && /* @__PURE__ */ jsx("div", { className: "pt-4 pb-10", children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleUnlockAll,
                      className: "w-full bg-agency-main/10 hover:bg-agency-main/20 border border-agency-main/50 text-agency-main font-bold py-3 px-4 rounded shadow-[0_0_15px_rgba(14,165,233,0.1)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]",
                      children: [
                        /* @__PURE__ */ jsx(Unlock, { className: "w-5 h-5" }),
                        "WYPE\u0141NIJ DANYMI Z SYSTEMU"
                      ]
                    }
                  ) })
                ] }),
                activeSubTab === "schedule" && /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col animate-in fade-in slide-in-from-right-2 duration-300", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-4 overflow-x-auto pb-2 shrink-0", children: ["Poniedzia\u0142ek", "Wtorek", "\u015Aroda", "Czwartek", "Pi\u0105tek", "Sobota", "Niedziela"].map((day) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setScheduleDay(day),
                      className: `
                                            px-3 py-1.5 text-[10px] uppercase font-bold rounded border transition-colors whitespace-nowrap
                                            ${scheduleDay === day ? "bg-agency-main text-black border-agency-main" : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600"}
                                        `,
                      children: day
                    },
                    day
                  )) }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-950/50 border border-slate-800 rounded-lg p-4 flex-1 overflow-y-auto custom-scrollbar", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "text-agency-main font-bold uppercase text-xs mb-4 flex items-center gap-2 border-b border-slate-800 pb-2", children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                      " Plan Dnia: ",
                      scheduleDay
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activeVictim.routine && activeVictim.routine[scheduleDay] ? activeVictim.routine[scheduleDay].map((item, index) => {
                      const IconComponent = getIcon(item.icon);
                      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 group", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-12 text-right text-xs font-mono text-slate-500 group-hover:text-agency-main transition-colors", children: item.time }),
                        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-slate-800 group-hover:bg-agency-main transition-colors relative", children: index !== activeVictim.routine[scheduleDay].length - 1 && /* @__PURE__ */ jsx("div", { className: "absolute top-2 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-800 group-hover:bg-agency-main/50" }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black border border-slate-800 p-2 rounded flex items-center gap-3 text-xs text-slate-400", children: [
                          /* @__PURE__ */ jsx(IconComponent, { className: "w-3 h-3 text-slate-600" }),
                          item.activity
                        ] })
                      ] }, index);
                    }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-10 opacity-50 text-slate-500", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 mb-2" }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs font-mono uppercase tracking-widest", children: "BRAK DANYCH OPERACYJNYCH" }),
                      /* @__PURE__ */ jsx("div", { className: "text-[9px] mt-1", children: "Wymagane przeprowadzenie \u015Bledztwa terenowego" })
                    ] }) })
                  ] })
                ] }),
                activeSubTab === "notes" && /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col animate-in fade-in slide-in-from-right-2 duration-300", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 p-3 mb-4 rounded flex items-center gap-3 text-slate-400 text-xs", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2 bg-slate-800 rounded-full", children: /* @__PURE__ */ jsx(Clipboard, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-bold uppercase text-agency-main", children: "Notatnik Operacyjny" }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] opacity-70", children: "Dane s\u0105 szyfrowane lokalnie (AES-256)." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    TextAreaField,
                    {
                      label: "Tre\u015B\u0107 Notatki",
                      value: activeVictim.notes,
                      onChange: (v) => updateVictim("notes", v),
                      rows: 25
                    }
                  )
                ] })
              ] })
            ] })
          )
        ] })
      ]
    }
  );
};
var stdin_default = VictimFilePanel;
export {
  stdin_default as default
};
