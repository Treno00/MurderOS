import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Key, ShieldAlert, Phone, CheckCircle, XCircle, VolumeX, Volume2, AlertTriangle } from "lucide-react";
import { GameState } from "../../Scripts/App/GameState.js";

const ActionBreach = ({ onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [minigameState, setMinigameState] = useState("IDLE"); // IDLE, PLAYING, SUCCESS, FAILED
  
  const [noiseLevel, setNoiseLevel] = useState(0); // 0-100%

  // Wytrych state
  const [lockPins, setLockPins] = useState([0, 0, 0, 0, 0]); // 0 = locked, 1 = unlocked
  const [sweetSpot, setSweetSpot] = useState(0); 
  const [currentTension, setCurrentTension] = useState(0);
  const [pickHealth, setPickHealth] = useState(3);

  // Łom state
  const [crowbarProgress, setCrowbarProgress] = useState(0);
  const [crowbarTarget, setCrowbarTarget] = useState(50);
  const [crowbarDirection, setCrowbarDirection] = useState(1);
  const [crowbarHits, setCrowbarHits] = useState(0);

  // Inżynieria Społeczna state
  const victim = GameState.getActiveVictim() || { firstName: "Jan", lastName: "Kowalski", pesel: "90010112345", city: "Warszawa", address: "Główna 1" };
  const [socialRole, setSocialRole] = useState(null); 
  const [socialStep, setSocialStep] = useState(0); 
  const [socialQuestions, setSocialQuestions] = useState([]);
  const [socialAnswers, setSocialAnswers] = useState({});
  const [socialFailedForTarget, setSocialFailedForTarget] = useState(false);

  const planRisk = GameState.currentActionPlan?.risk || 50;

  const getNoiseColor = () => {
    if (noiseLevel < 30) return "text-emerald-500 bg-emerald-500";
    if (noiseLevel < 70) return "text-amber-500 bg-amber-500";
    return "text-red-500 bg-red-500";
  };

  useEffect(() => {
    if (noiseLevel >= 100 && minigameState === "PLAYING") {
      setMinigameState("FAILED");
      setSocialFailedForTarget(true); // Can't social engineer if alarm goes off
    }
  }, [noiseLevel, minigameState]);

  const setupSocialRole = (role) => {
    setSocialRole(role);
    setSocialStep(1);
    
    if (role === "POLICE") {
      setSocialQuestions([
        { id: "q1", parts: ["Dzień dobry, czy to ", { id: "firstName", placeholder: "Imię" }, " ", { id: "lastName", placeholder: "Nazwisko" }, "?"], response: "-Tak to ja, w czym mogę pomóc?" },
        { id: "q2", parts: ["Jestem oficerem śledczym musimy porozmawiać odnośnie ", { id: "fines", placeholder: "Wyrok/Grzywna" }, "."], response: "-Stało się coś w związku z tym?" },
        { id: "q3", parts: ["Czy ", { id: "registeredAddress", placeholder: "Adres Zameldowania" }, " w ", { id: "city", placeholder: "Miasto Zameldowania" }, ", jest dalej poprawnym adresem zameldowania?"], response: "-Tak, zgadza się" },
        { id: "q4", parts: ["Czy zatrudnienie w ", { id: "companyName", placeholder: "Firma" }, " jako ", { id: "employment", placeholder: "Zatrudnienie" }, " jest dalej aktualne?"], response: "-Tak, wszystko się zgadza" },
        { id: "q5", parts: ["Czy możemy porozmawiać w środku?"], response: "-Tak zapraszam", isFinal: true }
      ]);
    } else if (role === "DOCTOR") {
      setSocialQuestions([
        { id: "q1", parts: ["Dzień dobry, czy mam przyjemność rozmawiać z ", { id: "firstName", placeholder: "Imię" }, " ", { id: "lastName", placeholder: "Nazwisko" }, "?"], response: "-Tak, o co chodzi?" },
        { id: "q2", parts: ["Jestem lekarzem i przyszedłem porozmawiać odnośnie ", { id: "diseases", placeholder: "Choroba/Uzależnienia" }, "."], response: "-Rozumiem, a w czym jest problem?" },
        { id: "q3", parts: ["Chodzi o to że grupa krwi ", { id: "bloodType", placeholder: "Grupa Krwi" }, " oraz BMI ", { id: "bmi", placeholder: "BMI" }, " może mieć kolosalny wpływ na zdrowie."], response: "-Czy mam się martwić?" },
        { id: "q4", parts: ["Tego jeszcze nie wiem, czy ", { id: "insuranceNumber", placeholder: "NR ubezpieczenia" }, " się zgadza?"], response: "-Tak, z tego co pamiętam to raczej tak" },
        { id: "q5", parts: ["Czy możemy porozmawiać w środku?"], response: "-Tak zapraszam", isFinal: true }
      ]);
    } else if (role === "BANKER") {
      setSocialQuestions([
        { id: "q1", parts: ["Witam, reprezentuję ", { id: "bankName", placeholder: "Nazwa Banku" }, " czy to ", { id: "firstName", placeholder: "Imię" }, " ", { id: "lastName", placeholder: "Nazwisko" }, "?"], response: "-Tak to ja, w czym problem?" },
        { id: "q2", parts: ["Zarejestrowany pojazd o numerach ", { id: "licensePlate", placeholder: "Rejestracja" }, " jest połączony z kontem o numerze ", { id: "accountNumber", placeholder: "Numer Konta" }, "."], response: "-Tak to prawda" },
        { id: "q3", parts: ["Chodzi o to że wykryto nieprawidłowości na karcie kończącej się na ", { id: "cardNumberEnds", placeholder: "ostatnie 4 cyfry nr. karty" }, "."], response: "-Nie rozumiem, jak do tego doszło?" },
        { id: "q4", parts: ["To właśnie staramy się ustalić, czy ", { id: "phoneNumber", placeholder: "Numer Telefonu" }, " jest dalej preferowanym numerem kontaktowym?"], response: "-Tak, zgadza się" },
        { id: "q5", parts: ["Czy moglibyśmy porozmawiać w środku?"], response: "-Tak, tak, zapraszam", isFinal: true }
      ]);
    }
  };

  useEffect(() => {
    if (selectedMethod === "LOCKPICK" && minigameState === "PLAYING") {
      setSweetSpot(Math.floor(Math.random() * 100));
    }
  }, [selectedMethod, minigameState]);

  const handleLockpickTension = (e) => {
    if (minigameState !== "PLAYING") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pos = Math.floor((x / rect.width) * 100);
    setCurrentTension(pos);
  };

  const attemptLockpick = () => {
    if (minigameState !== "PLAYING") return;
    const diff = Math.abs(currentTension - sweetSpot);
    
    if (diff <= 12) { 
      const newPins = [...lockPins];
      const nextPinIdx = newPins.findIndex(p => p === 0);
      if (nextPinIdx !== -1) {
        newPins[nextPinIdx] = 1;
        setLockPins(newPins);
        
        // Small noise for click
        setNoiseLevel(n => Math.min(100, n + 5));

        if (nextPinIdx === 4) {
          setMinigameState("SUCCESS");
        } else {
          setSweetSpot(Math.floor(Math.random() * 100));
        }
      }
    } else { 
      // Fail
      setNoiseLevel(n => Math.min(100, n + (planRisk > 50 ? 20 : 10))); // Breaking pick makes noise!
      if (pickHealth > 1) {
        setPickHealth(h => h - 1);
      } else {
        setLockPins([0, 0, 0, 0, 0]);
        setMinigameState("FAILED");
      }
    }
  };

  useEffect(() => {
    let interval;
    if (selectedMethod === "CROWBAR" && minigameState === "PLAYING") {
      interval = setInterval(() => {
        setCrowbarProgress(p => {
          let next = p + ((1.5 * crowbarDirection));
          if (next >= 100) { setCrowbarDirection(-1); return 100; }
          if (next <= 0) { setCrowbarDirection(1); return 0; }
          return next;
        });
      }, 20); 
    }
    return () => clearInterval(interval);
  }, [selectedMethod, minigameState, crowbarDirection]);

  const handleCrowbarHit = () => {
    if (minigameState !== "PLAYING") return;
    
    const tolerance = 25 - (crowbarHits * 4); 
    const diff = Math.abs(crowbarProgress - crowbarTarget);
    
    if (diff <= tolerance) {
      setNoiseLevel(n => Math.min(100, n + (planRisk > 50 ? 30 : 15))); // Hit makes huge noise

      if (crowbarHits + 1 >= 3) {
        setMinigameState("SUCCESS");
      } else {
        setCrowbarHits(h => h + 1);
        setCrowbarTarget(Math.floor(Math.random() * 50) + 25);
      }
    } else {
      // Missed hit makes HORRENDOUS noise
      setNoiseLevel(n => Math.min(100, n + 40));
      if (noiseLevel + 40 >= 100) {
        setMinigameState("FAILED");
      }
    }
  };

  const handleSocialStepSubmit = () => {
    const currentQ = socialQuestions[socialStep - 1];
    let stepCorrect = true;
    
    const fields = currentQ.parts.filter(part => typeof part === "object");

    for (const field of fields) {
      let correctVal = victim[field.id];
      const userVal = String(socialAnswers[`${currentQ.id}_${field.id}`] || "").toLowerCase().trim();
      
      if (userVal === "brak") {
        if (Array.isArray(correctVal) ? correctVal.length > 0 : (correctVal && correctVal.toLowerCase().trim() !== "brak")) {
          stepCorrect = false;
          break;
        } else {
          continue; 
        }
      }

      if (Array.isArray(correctVal)) {
        if (correctVal.length === 0) {
          if (userVal !== "brak") { stepCorrect = false; break; }
        } else {
          const matchedAny = correctVal.some(item => 
            String(item).toLowerCase().trim().includes(userVal) || userVal.includes(String(item).toLowerCase().trim())
          );
          if (!matchedAny) {
            stepCorrect = false;
            break;
          }
        }
      } else {
        if (correctVal === undefined || correctVal === null || correctVal === "") {
          correctVal = "brak";
        } else {
          correctVal = String(correctVal).toLowerCase().trim();
        }
        
        if (correctVal !== userVal && !(field.id === "lastName" && userVal.includes(correctVal))) {
          stepCorrect = false;
          break;
        }
      }
    }

    if (!stepCorrect) {
      setNoiseLevel(n => Math.min(100, n + 100)); // Instant police/alarm on wrong word
      setMinigameState("FAILED");
      setSocialFailedForTarget(true);
    } else {
      if (currentQ.isFinal) {
        setMinigameState("SUCCESS");
      } else {
        if (socialStep < socialQuestions.length) {
          setSocialStep(s => s + 1);
        } else {
          setMinigameState("SUCCESS");
        }
      }
    }
  };

  const resetMinigame = () => {
    setMinigameState("IDLE");
    setLockPins([0,0,0,0,0]);
    setCurrentTension(0);
    setPickHealth(3);
    setCrowbarProgress(0);
    setCrowbarTarget(Math.floor(Math.random() * 50) + 25);
    setCrowbarHits(0);
    setSocialRole(null);
    setSocialStep(0);
    setSocialAnswers({});
    if (noiseLevel >= 100) {
       setNoiseLevel(0); // Cooldown to try another method? Or maybe forces escape...
    }
  };

  const startMinigame = (method) => {
    setSelectedMethod(method);
    resetMinigame();
    setMinigameState("PLAYING");
  };

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col gap-6 animate-in fade-in custom-scrollbar text-emerald-500/80 p-4", style: { backgroundColor: "#020804" }, children: [
    
    /* Header (NVG Style) */
    /* @__PURE__ */ jsxs("div", { className: "border border-emerald-900/50 bg-[#051008] rounded p-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] shrink-0 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-4 h-4" }), "Akcja: Infiltracja Terenu"
        ]}),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-700 font-mono mt-1", children: "NVG TACTICAL HUD ONLINE" })
      ]}),
      
      /* Noise Meter Global */
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border border-zinc-800 bg-black px-4 py-2 rounded", children: [
         /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
             /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1", children: "Wykrycie Dźwiękiem" }),
             /* @__PURE__ */ jsxs("div", { className: "w-32 h-1.5 bg-zinc-900 rounded-full overflow-hidden flex", children: [
                /* @__PURE__ */ jsx("div", { className: `h-full transition-all duration-300 ${getNoiseColor().split(' ')[1]}`, style: { width: `${noiseLevel}%` } })
             ]})
         ]}),
         /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900", children:
             noiseLevel >= 70 ? /* @__PURE__ */ jsx(Volume2, { className: `w-4 h-4 ${getNoiseColor().split(' ')[0]} animate-pulse` }) : /* @__PURE__ */ jsx(VolumeX, { className: `w-4 h-4 ${getNoiseColor().split(' ')[0]}` })
         })
      ]})
    ]}),

    /* Methods Selection or Active Minigame */
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex gap-6", children: 
      minigameState === "IDLE" ? (
        /* METHOD SELECTION */
        /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-3 gap-6", children: [
          
          /* Wytrych */
          /* @__PURE__ */ jsxs("div", { 
            onClick: () => startMinigame("LOCKPICK"),
            className: "bg-[#040d06] border border-emerald-900/40 rounded p-6 shadow-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-emerald-900/20 hover:border-emerald-500 transition-all group", 
            children: [
              /* @__PURE__ */ jsx(Key, { className: "w-16 h-16 text-emerald-800 group-hover:text-emerald-500 transition-colors" }),
              /* @__PURE__ */ jsx("h4", { className: "font-black uppercase tracking-widest text-sm text-emerald-500", children: "Wytrych" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center font-mono text-emerald-700", children: "Wyważony balans ryzyka i hałasu." })
            ]
          }),

          /* Łom */
          /* @__PURE__ */ jsxs("div", { 
            onClick: () => startMinigame("CROWBAR"),
            className: "bg-[#040d06] border border-emerald-900/40 rounded p-6 shadow-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-red-900/20 hover:border-red-500 transition-all group", 
            children: [
              /* @__PURE__ */ jsx(ShieldAlert, { className: "w-16 h-16 text-emerald-800 group-hover:text-red-500 transition-colors" }),
              /* @__PURE__ */ jsx("h4", { className: "font-black uppercase tracking-widest text-sm text-red-500/80 group-hover:text-red-500", children: "Łom Taktyczny" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center font-mono text-emerald-700", children: "Błyskawiczne wejście. Ryzyko pęknięcia bębenków." })
            ]
          }),

          /* Inżynieria Społeczna */
          /* @__PURE__ */ jsxs("div", { 
            onClick: () => {
              if (!socialFailedForTarget) startMinigame("SOCIAL");
            },
            className: `bg-[#040d06] border ${socialFailedForTarget ? 'border-zinc-800 opacity-50 cursor-not-allowed' : 'border-emerald-900/40 cursor-pointer hover:bg-blue-900/20 hover:border-blue-500'} rounded p-6 shadow-lg flex flex-col items-center justify-center gap-4 transition-all group`, 
            children: [
              /* @__PURE__ */ jsx(Phone, { className: `w-16 h-16 ${socialFailedForTarget ? 'text-zinc-800' : 'text-emerald-800 group-hover:text-blue-500'} transition-colors` }),
              /* @__PURE__ */ jsx("h4", { className: `font-black uppercase tracking-widest text-sm ${socialFailedForTarget ? 'text-zinc-600' : 'text-blue-500/80 group-hover:text-blue-500'}`, children: "Inżynieria Społ." }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center font-mono text-emerald-700", children: socialFailedForTarget ? "Cel zaalarmowany." : "Maskowanie głosowe." })
            ]
          })
        ]})
      ) : (
        /* MINIGAME PLAY AREA */
        /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black border border-emerald-900/50 rounded p-8 shadow-2xl flex flex-col items-center justify-center relative", children: [
          /* Back Button */
          /* @__PURE__ */ jsx("button", { 
             onClick: () => setMinigameState("IDLE"),
             className: "absolute top-4 left-4 text-[10px] uppercase font-bold text-emerald-700 hover:text-emerald-400 transition-colors",
             children: "« ABORT OPERATION"
          }),

          minigameState === "SUCCESS" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-emerald-400 animate-in zoom-in", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-24 h-24 mb-4" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black uppercase tracking-widest", children: "INFILTRACJA UDANA" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xs mt-2 opacity-80 mb-6 text-emerald-700", children: "Teren czysty. Obiekt zabezpieczony z zewnątrz." }),
            /* @__PURE__ */ jsx("button", { 
              onClick: () => {
                if (GameState.currentActionPlan) {
                  GameState.currentActionPlan.stealthBreach = (noiseLevel < 40 && selectedMethod !== "CROWBAR");
                }
                onComplete && onComplete();
              },
              className: "bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]",
              children: "PRZEJDŹ DO ELIMINACJI >>"
            })
          ]}),

          minigameState === "FAILED" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-red-500 animate-in zoom-in w-full text-center max-w-sm", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "w-24 h-24 mb-4" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black uppercase tracking-widest", children: "ALARM / WYKRYCIE" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xs mt-2 mb-6 text-red-900", children: noiseLevel >= 100 ? "Przekroczono limit hałasu! Świadkowie dzwonią na policję." : "Operacja spalona." }),
            /* @__PURE__ */ jsx("button", { 
              onClick: resetMinigame,
              className: "bg-red-900 hover:bg-red-800 text-black border border-red-500 font-bold uppercase tracking-widest text-xs px-6 py-2 rounded",
              children: "EWAKUACJA (WRÓĆ DO WYBORU)"
            })
          ]}),

          /* WYTRYCH ACTIVE */
          minigameState === "PLAYING" && selectedMethod === "LOCKPICK" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full max-w-lg", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4", children: "Analiza Mechanizmu Zapadkowego" }),
            
            /* Add Pick Health text */
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-mono text-emerald-800 mb-8", children: [
              "Wytrzymałość Narzędzia: ", /* @__PURE__ */ jsx("span", { className: pickHealth > 1 ? "text-emerald-400 font-bold" : "text-red-500 font-bold", children: pickHealth })
            ]}),

            /* Visual representation of pins */
            /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-8", children: 
              lockPins.map((pin, index) => /* @__PURE__ */ jsx("div", {
                key: index,
                className: `w-8 h-24 border border-emerald-900/50 rounded-t-full relative flex items-end p-0.5
                  ${pin ? 'bg-emerald-500/20 border-emerald-500' : 'bg-[#030905]'}
                `,
                children: /* @__PURE__ */ jsx("div", {
                  className: `w-full rounded transition-all duration-300 ${pin ? 'h-6 bg-emerald-500' : 'h-16 bg-emerald-900/30'}`
                })
              }))
            }),

            /* Interaction Area */
            /* @__PURE__ */ jsxs("div", { className: "w-full mb-8 relative", children: [
              /* @__PURE__ */ jsx("p", { className: "text-center text-[9px] text-emerald-700 uppercase font-mono mb-2", children: "Sygnał termiczny pinów (Skanowanie...)" }),
              /* @__PURE__ */ jsxs("div", { 
                className: "h-12 w-full bg-[#030905] border-2 border-emerald-900/50 rounded relative cursor-crosshair overflow-hidden group",
                onMouseMove: handleLockpickTension,
                onClick: attemptLockpick,
                children: [
                  /* Tension line based on distance */
                  /* @__PURE__ */ jsx("div", {
                    className: "absolute top-0 bottom-0 w-1 pointer-events-none transition-all duration-75",
                    style: { 
                      left: `${currentTension}%`,
                      backgroundColor: Math.abs(currentTension - sweetSpot) <= 12 ? '#10b981' : Math.abs(currentTension - sweetSpot) <= 30 ? '#059669' : '#064e3b',
                      boxShadow: Math.abs(currentTension - sweetSpot) <= 12 ? '0 0 15px rgba(16,185,129,0.8)' : 'none'
                    }
                  }),
                  /* Helper info on hover */
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-emerald-500/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", children: 
                    /* @__PURE__ */ jsx("span", { className: "text-emerald-500 text-[10px] font-bold uppercase tracking-widest", children: "NACIŚNIJ ABY AKTYWOWAĆ NACIĄG" })
                  })
                ]
              })
            ]})
          ]}),

          /* ŁOM ACTIVE */
          minigameState === "PLAYING" && selectedMethod === "CROWBAR" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full max-w-md", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-red-500 font-bold uppercase text-xs tracking-widest mb-4", children: "Kinetyczne Wyłamanie" }),
            
            /* Status text */
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-mono text-emerald-800 mb-8", children: [
              "Faza Niszczenia: ", /* @__PURE__ */ jsx("span", { className: "text-red-400 font-bold tracking-widest", children: `[ ${crowbarHits} / 3 ]` })
            ]}),
            
            /* Bar */
            /* @__PURE__ */ jsxs("div", { className: "w-full h-8 bg-[#030905] border border-emerald-900/50 rounded-full relative overflow-hidden mb-8", children: [
              /* Target Area */
              /* @__PURE__ */ jsx("div", { 
                className: "absolute top-0 bottom-0 bg-red-500/30 border-x border-red-500",
                style: { left: `${Math.max(0, crowbarTarget - (25 - (crowbarHits * 4)))}%`, width: `${(25 - (crowbarHits * 4)) * 2}%` }
              }),
              /* Moving Cursor */
              /* @__PURE__ */ jsx("div", { 
                className: "absolute top-0 bottom-0 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]",
                style: { left: `${crowbarProgress}%`, transform: 'translateX(-50%)' }
              })
            ]}),

            /* @__PURE__ */ jsx("button", {
              onClick: handleCrowbarHit,
              className: "w-full bg-red-900/50 hover:bg-red-800/80 border border-red-500 text-red-500 hover:text-white font-black uppercase py-4 rounded transition-all text-xs tracking-widest",
              children: "UDERZ"
            })
          ]}),

          /* SOCIAL ACTIVE */
          minigameState === "PLAYING" && selectedMethod === "SOCIAL" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full max-w-2xl text-center", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-blue-500 font-bold text-xs uppercase tracking-widest mb-6 border-b border-blue-900/50 pb-2 w-full", children: "Symulacja Głosu (Eng. Społeczna)" }),
            
            socialStep === 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4 w-full", children: [
              /* @__PURE__ */ jsx("p", { className: "text-emerald-700 font-mono text-[10px] mb-4 uppercase tracking-widest", children: "Inicjacja modułu audio-przykrywki. Wybierz wektor ataku:" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setupSocialRole("POLICE"), className: "bg-blue-900/10 border border-blue-900/50 shadow-lg p-4 rounded hover:bg-blue-900/30 hover:border-blue-500 transition-all font-bold text-blue-500/50 hover:text-blue-400 uppercase text-xs tracking-widest", children: "Oficer Śledczy" }),
                /* @__PURE__ */ jsx("button", { onClick: () => setupSocialRole("DOCTOR"), className: "bg-emerald-900/10 border border-emerald-900/50 shadow-lg p-4 rounded hover:bg-emerald-900/30 hover:border-emerald-500 transition-all font-bold text-emerald-500/50 hover:text-emerald-400 uppercase text-xs tracking-widest", children: "Pracownik Medyczny" }),
                /* @__PURE__ */ jsx("button", { onClick: () => setupSocialRole("BANKER"), className: "bg-amber-900/10 border border-amber-900/50 shadow-lg p-4 rounded hover:bg-amber-900/30 hover:border-amber-500 transition-all font-bold text-amber-500/50 hover:text-amber-400 uppercase text-xs tracking-widest", children: "Dział Bezp. Banku" })
              ]})
            ]}),

            socialStep > 0 && socialStep <= socialQuestions.length && /* @__PURE__ */ jsxs("div", { className: "w-full space-y-6 animate-in fade-in slide-in-from-right-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[#020503] border border-blue-900/30 p-8 rounded relative", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -left-2 top-2 bg-blue-900 text-blue-300 border border-blue-500 text-[9px] font-bold px-2 py-1 uppercase rounded-r", children: `SEKWENCJA [${socialStep}/${socialQuestions.length}]` }),
                
                /* Target's "door" is open a crack */
                /* @__PURE__ */ jsx("div", { className: "mb-6 text-left border-l-[2px] border-emerald-900 pl-4 py-1 flex items-start flex-col gap-2", children: [
                   /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-500/70 font-mono italic whitespace-pre-line", children: socialStep === 1 ? `[Cel uchyla nieznacznie drzwi, przypatrując się Tobie podejrzliwie. "-Słucham?"]` : `[${socialQuestions[socialStep - 2].response}]` })
                ]}),

                /* Player's dialogue */
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-start gap-y-3 gap-x-1 text-xs font-mono text-emerald-400 mt-4 leading-relaxed text-left border border-emerald-900/30 bg-emerald-900/10 p-4 rounded", children: 
                  socialQuestions[socialStep-1].parts.map((part, index) => {
                    if (typeof part === "string") {
                      return /* @__PURE__ */ jsx("span", { key: index, children: part });
                    } else {
                      return /* @__PURE__ */ jsx("input", {
                        key: part.id,
                        type: "text",
                        placeholder: part.placeholder,
                        className: "w-40 bg-black border-b border-emerald-500/50 px-2 py-1 text-emerald-300 placeholder:text-emerald-900 text-xs font-bold outline-none focus:border-emerald-400 focus:bg-[#030905] transition-colors mx-1",
                        value: socialAnswers[`${socialQuestions[socialStep-1].id}_${part.id}`] || "",
                        onChange: (e) => setSocialAnswers({...socialAnswers, [`${socialQuestions[socialStep-1].id}_${part.id}`]: e.target.value})
                      });
                    }
                  })
                })
              ]}),
              /* @__PURE__ */ jsx("button", {
                onClick: handleSocialStepSubmit,
                className: "w-full bg-blue-900 hover:bg-blue-800 border border-blue-500 text-white font-black uppercase py-4 rounded shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all text-xs tracking-widest",
                children: "DALEJ >>"
              })
            ]})
          ]})

        ]})
      )
    })
  ]});
};

export default ActionBreach;
