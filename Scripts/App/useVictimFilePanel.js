import { useState, useEffect } from "react";
import { createEmptyVictim } from "./VictimFile.js";
import { EVENTS } from "./events.js";
import { GameState } from "./GameState.js";
import { useGame } from "./GameContext.js";
const useVictimFilePanel = () => {
  const { isVictimPanelOpen, toggleVictimPanel, setVictimPanelOpen, settings } = useGame();
  const [victims, setVictims] = useState(GameState.getVictimFiles());
  const [activeTabId, setActiveTabId] = useState(GameState.getActiveVictimId());
  const [activeSubTab, setActiveSubTab] = useState("files");
  const [scheduleDay, setScheduleDay] = useState("Poniedzia\u0142ek");
  const activeVictim = victims.find((v) => v.id === activeTabId) || (victims.length > 0 ? victims[0] : void 0);
  useEffect(() => {
    GameState.setVictimFiles(victims);
  }, [victims]);
  useEffect(() => {
    GameState.setActiveVictimId(activeTabId);
  }, [activeTabId]);
  useEffect(() => {
    const handleDataTransfer = (e) => {
      const customEvent = e;
      const incomingData = customEvent.detail;
      if (victims.length === 0) {
        const newVictim = createEmptyVictim();
        const updatedVictim = { ...newVictim, ...incomingData };
        setVictims([updatedVictim]);
        setActiveTabId(newVictim.id);
      } else {
        setVictims((prevVictims) => prevVictims.map((v) => {
          if (v.id === activeTabId) {
            return { ...v, ...incomingData };
          }
          return v;
        }));
      }
      if (!isVictimPanelOpen) setVictimPanelOpen(true);
    };
    const handleCloseFile = (e) => {
      const customEvent = e;
      const { pesel } = customEvent.detail;
      setVictims((prev) => {
        const newVictims = prev.filter((v) => v.pesel !== pesel);
        if (newVictims.length === 0) {
          setActiveTabId("");
          return [];
        }
        const closedVictim = prev.find((v) => v.pesel === pesel);
        if (closedVictim && closedVictim.id === activeTabId) {
          setActiveTabId(newVictims[0].id);
        }
        return newVictims;
      });
    };
    const handleAddNewVictimFile = (e) => {
      const customEvent = e;
      const incomingData = customEvent.detail;
      const newVictim = createEmptyVictim();
      const updatedVictim = { ...newVictim, ...incomingData };
      setVictims((prev) => [...prev, updatedVictim]);
      setActiveTabId(updatedVictim.id);
      if (!isVictimPanelOpen) setVictimPanelOpen(true);
    };
    window.addEventListener(EVENTS.TRANSFER_DATA, handleDataTransfer);
    window.addEventListener(EVENTS.CLOSE_VICTIM_FILE, handleCloseFile);
    window.addEventListener(EVENTS.ADD_NEW_VICTIM_FILE, handleAddNewVictimFile);
    return () => {
      window.removeEventListener(EVENTS.TRANSFER_DATA, handleDataTransfer);
      window.removeEventListener(EVENTS.CLOSE_VICTIM_FILE, handleCloseFile);
      window.removeEventListener(EVENTS.ADD_NEW_VICTIM_FILE, handleAddNewVictimFile);
    };
  }, [activeTabId, isVictimPanelOpen, setVictimPanelOpen, victims.length]);
  const updateVictim = (field, value) => {
    if (!activeVictim) return;
    setVictims((prev) => prev.map((v) => v.id === activeTabId ? { ...v, [field]: value } : v));
  };
  const addVictim = () => {
    const newVictim = createEmptyVictim();
    setVictims([...victims, newVictim]);
    setActiveTabId(newVictim.id);
  };
  const removeVictim = (e, id) => {
    e.stopPropagation();
    const newVictims = victims.filter((v) => v.id !== id);
    setVictims(newVictims);
    if (activeTabId === id) {
      setActiveTabId(newVictims.length > 0 ? newVictims[0].id : "");
    }
  };
  const getValidationColor = (field, ignoreSettings = false) => {
    if (!settings.highlightConsistency && !ignoreSettings) return void 0;
    if (!activeVictim) return void 0;
    const val = activeVictim[field];
    let citizen = GameState.getAllCitizens().find((c) => c.pesel === activeVictim.pesel);
    if (!citizen) return "border-red-500 focus:border-red-500";
    
    if (field === "familyMembers") {
        if (!val || val.length === 0) {
           return (!citizen.connections || citizen.connections.length === 0) ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500";
        }
        
        if (!citizen.connections) return "border-red-500 focus:border-red-500";
        
        let allValid = val.every(member => {
            if (!member.firstName || !member.lastName || !member.relation) return false;
            return citizen.connections.some(conn => {
                const connCit = GameState.getAllCitizens().find(c => c.id === conn.personId);
                if (!connCit) return false;
                const fMatch = connCit.firstName.toLowerCase() === member.firstName.toLowerCase();
                const lMatch = connCit.lastName.toLowerCase() === member.lastName.toLowerCase();
                const rMatch = conn.type === member.relation;
                return fMatch && lMatch && rMatch;
            });
        });

        // if the lengths are different, it's not a complete match ("całokształt")
        if (allValid && val.length === citizen.connections.length) {
            return "border-green-500 focus:border-green-500";
        }
        
        return "border-red-500 focus:border-red-500";
    }

    if (typeof val !== "string") return void 0;
    if (!val || val === "" || val === "---") return void 0;
    if (!activeVictim.pesel) return void 0;
    
    let expected = "";
    const isStudent = citizen.jobTitle.startsWith("Ucze\u0144");
    switch (field) {
      case "firstName":
        expected = citizen.firstName;
        break;
      case "lastName":
        expected = citizen.lastName;
        break;
      case "pesel":
        expected = citizen.pesel;
        break;
      case "birthDate":
        expected = citizen.birthDate;
        break;
      case "maritalStatus":
        expected = citizen.relationshipStatus;
        break;
      case "phoneNumber":
        expected = citizen.phoneNumber;
        break;
      // Education Section (Direct Comparison)
      case "education":
        expected = citizen.education;
        break;
      case "schoolName":
        expected = citizen.schoolName;
        break;
      case "schoolAddress":
        expected = citizen.schoolAddress;
        break;
      case "mainExamTitle":
        expected = citizen.mainExamTitle;
        break;
      case "mainExamYear":
        expected = citizen.mainExamYear;
        break;
      case "mainExamGrade":
        expected = citizen.mainExamGrade;
        break;
      case "extraExamTitle":
        expected = citizen.extraExamTitle;
        break;
      case "extraExamYear":
        expected = citizen.extraExamYear;
        break;
      case "extraExamGrade":
        expected = citizen.extraExamGrade;
        break;
      case "city":
        expected = citizen.city;
        break;
      case "livingCity":
        expected = citizen.livingCity;
        break;
      case "workCity":
        expected = citizen.workCity;
        break;
      case "currentCity":
        expected = citizen.currentCity;
        break;
      case "actualCity":
        expected = citizen.currentCity;
        break;
      case "registeredAddress":
        expected = citizen.address;
        break;
      case "livingAddress":
        expected = citizen.livingAddress;
        break;
      case "currentAddress":
        expected = citizen.currentAddress;
        break;
      case "actualAddress":
        expected = citizen.currentAddress;
        break;
      case "livesWith":
        if (isStudent) {
          expected = "Rodzice";
        } else if (["\u017Bonaty", "Zam\u0119\u017Cna"].includes(citizen.relationshipStatus)) {
          expected = "Ma\u0142\u017Conek";
        } else if (["W zwi\u0105zku", "Narzeczony", "Narzeczona"].includes(citizen.relationshipStatus)) {
          expected = "Partner";
        } else {
          expected = "Samotnie";
        }
        break;
      case "employment":
        expected = isStudent ? "Brak" : citizen.jobTitle;
        break;
      case "companyName":
        expected = isStudent ? "Brak" : citizen.companyName;
        break;
      case "workAddress":
        expected = isStudent ? "Brak" : citizen.workAddress;
        break;
      case "accountNumber":
        expected = citizen.bankAccount;
        break;
      case "bankClientId":
        expected = citizen.bankClientId;
        break;
      case "bankName":
        expected = citizen.bankName;
        break;
      case "cardNumber":
        expected = citizen.creditCard;
        break;
      case "cardExpiry":
        expected = citizen.cardExpiry;
        break;
      case "cardCVV":
        expected = citizen.cardCvv;
        break;
      case "accountBalance":
        expected = citizen.accountBalance.toLocaleString("pl-PL", { minimumFractionDigits: 2 });
        break;
      case "income":
        expected = citizen.income.toFixed(2).replace(".", ",");
        break;
      case "netIncome":
        expected = citizen.netIncome.toFixed(2).replace(".", ",");
        break;
      case "vehicle":
        expected = citizen.vehicle || "Brak zarejestrowanych pojazd\xF3w";
        break;
      case "licensePlate":
        expected = citizen.licensePlate || "Brak";
        break;
      case "height":
        expected = citizen.height.toString();
        break;
      case "weight":
        expected = citizen.weight.toString();
        break;
      case "hairColor":
        expected = citizen.hairColor;
        break;
      case "eyeColor":
        expected = citizen.eyeColor;
        break;
      case "sentences":
        expected = citizen.sentences.join(", ") || "Brak";
        break;
      case "fines":
        expected = citizen.fines.join(", ") || "Brak";
        break;
      case "insuranceNumber":
        expected = `NFZ-${citizen.pesel.slice(0, 8)}`;
        break;
      case "bloodType":
        expected = citizen.bloodType;
        break;
      case "bmi":
        expected = (citizen.weight / (citizen.height / 100) ** 2).toFixed(1);
        break;
      case "diseases":
        expected = citizen.diseases.join(", ") || "Brak";
        break;
      case "addictions":
        expected = citizen.addictions.join(", ") || "Brak";
        break;
      case "psychologicalProfile":
        expected = citizen.psychologicalProfile;
        break;
      default:
        return void 0;
    }
    const normalize = (str) => str ? str.trim().toLowerCase().replace(/\s/g, "").replace(",", ".") : "";
    const normVal = normalize(val);
    const normExp = normalize(expected);
    if (!expected || expected === "" || expected === "Brak") {
      if (normVal === "brak" || normVal === "") return "border-green-500 focus:border-green-500";
    }
    if (field === "vehicle" && !citizen.vehicle && normVal === "brak") return "border-green-500 focus:border-green-500";
    if (normVal === normExp) return "border-green-500 focus:border-green-500";
    if (normVal.length >= 3 && normExp.includes(normVal)) {
      return "border-yellow-500 focus:border-yellow-500";
    }
    return "border-red-500 focus:border-red-500";
  };
  
  const getFamilyFieldColor = (index, fieldName) => {
    if (!settings.highlightConsistency) return undefined;
    if (!activeVictim || !activeVictim.familyMembers) return undefined;
    const member = activeVictim.familyMembers[index];
    if (!member) return undefined;
    let citizen = GameState.getAllCitizens().find((c) => c.pesel === activeVictim.pesel);
    if (!citizen || !citizen.connections) return "border-red-500 focus:border-red-500";
  
    const val = member[fieldName];
    if (!val) return "border-red-500 focus:border-red-500";
    
    // Validate if any connection matches this specific field
    const isValid = citizen.connections.some(conn => {
        const connCit = GameState.getAllCitizens().find(c => c.id === conn.personId);
        if (!connCit) return false;
        
        if (fieldName === "firstName") return connCit.firstName.toLowerCase() === val.toLowerCase();
        if (fieldName === "lastName") return connCit.lastName.toLowerCase() === val.toLowerCase();
        if (fieldName === "relation") return conn.type === val;
        return false;
    });

    return isValid ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500";
  };
  const checkSectionComplete = (fields, ignoreSettings = false) => {
    if (!activeVictim || !activeVictim.pesel) return false;
    return fields.every((field) => {
      const colorClass = getValidationColor(field, ignoreSettings);
      return colorClass && (colorClass.includes("border-green-500") || colorClass.includes("border-yellow-500"));
    });
  };
  const handleUnlockAll = () => {
    if (!activeVictim || !activeVictim.pesel) return;
    let citizen = GameState.getAllCitizens().find((c) => c.pesel === activeVictim.pesel);
    if (citizen) {
      const bmi = (citizen.weight / (citizen.height / 100) ** 2).toFixed(1);
      let livesWith = "Nieznane";
      const isStudent = citizen.jobTitle.startsWith("Ucze\u0144");
      if (isStudent) {
        livesWith = "Rodzice";
      } else {
        if (["\u017Bonaty", "Zam\u0119\u017Cna"].includes(citizen.relationshipStatus)) {
          livesWith = "Ma\u0142\u017Conek";
        } else if (["W zwi\u0105zku", "Narzeczony", "Narzeczona"].includes(citizen.relationshipStatus)) {
          livesWith = "Partner";
        } else if (["Singiel", "Singielka", "Rozwiedziony", "Rozwiedziona", "Wdowiec", "Wdowa"].includes(citizen.relationshipStatus)) {
          livesWith = "Samotnie";
        }
      }
      const familyMembers = [];
      if (citizen.connections) {
         citizen.connections.forEach(conn => {
            const connCitizen = GameState.getAllCitizens().find(c => c.id === conn.personId);
            if (connCitizen) {
               familyMembers.push({
                   relation: conn.type,
                   firstName: connCitizen.firstName,
                   lastName: connCitizen.lastName
               });
            }
         });
      }
      const fullData = {
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        birthDate: citizen.birthDate,
        maritalStatus: citizen.relationshipStatus,
        phoneNumber: citizen.phoneNumber,
        // Education Section (Direct Map)
        education: citizen.education,
        schoolName: citizen.schoolName,
        schoolAddress: citizen.schoolAddress,
        mainExamTitle: citizen.mainExamTitle,
        mainExamYear: citizen.mainExamYear,
        mainExamGrade: citizen.mainExamGrade,
        extraExamTitle: citizen.extraExamTitle,
        extraExamYear: citizen.extraExamYear,
        extraExamGrade: citizen.extraExamGrade,
        city: citizen.city,
        livingCity: citizen.livingCity,
        workCity: citizen.workCity,
        currentCity: citizen.currentCity,
        actualCity: citizen.currentCity,
        registeredAddress: citizen.address,
        livingAddress: citizen.livingAddress,
        currentAddress: citizen.currentAddress,
        actualAddress: citizen.currentAddress,
        livesWith,
        // Work (Logic specific for Students vs Workers)
        employment: isStudent ? "Brak" : citizen.jobTitle,
        companyName: isStudent ? "Brak" : citizen.companyName,
        workAddress: isStudent ? "Brak" : citizen.workAddress,
        accountNumber: citizen.bankAccount,
        bankClientId: citizen.bankClientId,
        bankName: citizen.bankName,
        cardNumber: citizen.creditCard,
        cardExpiry: citizen.cardExpiry,
        cardCVV: citizen.cardCvv,
        accountBalance: citizen.accountBalance.toFixed(2).replace(".", ","),
        income: citizen.income.toFixed(2).replace(".", ","),
        netIncome: citizen.netIncome.toFixed(2).replace(".", ","),
        vehicle: citizen.vehicle || "Brak",
        licensePlate: citizen.licensePlate || "Brak",
        height: citizen.height.toString(),
        weight: citizen.weight.toString(),
        hairColor: citizen.hairColor,
        eyeColor: citizen.eyeColor,
        insuranceNumber: `NFZ-${citizen.pesel.slice(0, 8)}`,
        bloodType: citizen.bloodType,
        bmi,
        diseases: citizen.diseases.join(", ") || "Brak",
        addictions: citizen.addictions.join(", ") || "Brak",
        psychologicalProfile: citizen.psychologicalProfile,
        sentences: citizen.sentences.join(", ") || "Brak",
        fines: citizen.fines.join(", ") || "Brak",
        routine: citizen.routine,
        familyMembers
      };
      setVictims((prev) => prev.map((v) => v.id === activeTabId ? { ...v, ...fullData } : v));
    }
  };
  return {
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
  };
};
export {
  useVictimFilePanel
};
