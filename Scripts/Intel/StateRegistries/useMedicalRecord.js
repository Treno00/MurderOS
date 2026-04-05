import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useMedicalRecord = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [bloodType, setBloodType] = useState(getAutofill(activeFile?.bloodType));
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputPesel, setInputPesel] = useState("");
  const [inputInsurance, setInputInsurance] = useState("");
  const [authError, setAuthError] = useState("");
  const results = useMemo(() => {
    if (!firstName && !lastName && !city && !bloodType) return [];
    return db.filter((p) => {
      const matchFirst = firstName ? p.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? p.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchCity = city ? p.city.toLowerCase().includes(city.toLowerCase()) || p.currentCity && p.currentCity.toLowerCase().includes(city.toLowerCase()) : true;
      const matchBlood = bloodType ? p.bloodType.toLowerCase() === bloodType.toLowerCase() : true;
      return matchFirst && matchLast && matchCity && matchBlood;
    });
  }, [db, firstName, lastName, city, bloodType]);
  const handleUnlockClick = (citizen) => {
    setSelectedCitizen(citizen);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputPesel(getAutofill(activeFile?.pesel));
    setInputInsurance(getAutofill(activeFile?.insuranceNumber));
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCitizen) return;
    const correctNFZ = `NFZ-${selectedCitizen.pesel.slice(0, 8)}`;
    if (inputPesel.trim() === selectedCitizen.pesel && inputInsurance.trim() === correctNFZ) {
      setShowAuthModal(false);
      if (!settings.noDecoding) {
        setIsDecoding(true);
        const delay = Math.floor(Math.random() * (3700 - 2e3 + 1) + 2e3);
        setTimeout(() => {
          setIsDecoding(false);
          setIsUnlocked(true);
        }, delay);
      } else {
        setIsUnlocked(true);
      }
    } else {
      setAuthError("AUTORYZACJA ODRZUCONA. Sprawd\u017A format NFZ.");
    }
  };
  const handleDownload = () => {
    if (!selectedCitizen || !isUnlocked) return;
    dispatchDataTransfer({
      height: selectedCitizen.height.toString(),
      weight: selectedCitizen.weight.toString(),
      bloodType: selectedCitizen.bloodType,
      diseases: selectedCitizen.diseases.length > 0 ? selectedCitizen.diseases.join(", ") : "Brak",
      addictions: selectedCitizen.addictions.length > 0 ? selectedCitizen.addictions.join(", ") : "Brak",
      psychologicalProfile: selectedCitizen.psychologicalProfile,
      insuranceNumber: `NFZ-${selectedCitizen.pesel.slice(0, 8)}`,
      // New Format
      bmi: (selectedCitizen.weight / (selectedCitizen.height / 100) ** 2).toFixed(1)
    });
  };
  const calculateBMI = (h, w) => (w / (h / 100) ** 2).toFixed(1);
  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    bloodType,
    setBloodType,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputPesel,
    setInputPesel,
    inputInsurance,
    setInputInsurance,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    calculateBMI,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useMedicalRecord
};
