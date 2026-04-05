import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const usePoliceRegistry = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [crimeCategory, setCrimeCategory] = useState("");
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputPesel, setInputPesel] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [authError, setAuthError] = useState("");
  const criminalDb = useMemo(() => {
    return db.filter((c) => c.sentences.length > 0 || c.fines.length > 0);
  }, [db]);
  const results = useMemo(() => {
    if (!firstName && !lastName && !city && !crimeCategory) return [];
    return criminalDb.filter((c) => {
      const matchFirst = firstName ? c.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? c.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchCity = city ? c.city.toLowerCase().includes(city.toLowerCase()) : true;
      const allCrimes = [...c.sentences, ...c.fines].join(" ").toLowerCase();
      const matchCrime = crimeCategory ? allCrimes.includes(crimeCategory.toLowerCase()) : true;
      return matchFirst && matchLast && matchCity && matchCrime;
    });
  }, [criminalDb, firstName, lastName, city, crimeCategory]);
  const handleUnlockClick = (c) => {
    setSelectedCriminal(c);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputPesel(getAutofill(activeFile?.pesel));
    setInputAge("");
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCriminal) return;
    const peselMatch = inputPesel.trim() === selectedCriminal.pesel;
    const ageMatch = parseInt(inputAge) === selectedCriminal.age;
    if (peselMatch && ageMatch) {
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
      setAuthError("B\u0141\u0104D WERYFIKACJI BIOMETRYCZNEJ.");
    }
  };
  const handleDownload = () => {
    if (!selectedCriminal || !isUnlocked) return;
    dispatchDataTransfer({
      sentences: selectedCriminal.sentences.length > 0 ? selectedCriminal.sentences.join(", ") : "Brak",
      fines: selectedCriminal.fines.length > 0 ? selectedCriminal.fines.join(", ") : "Brak",
      registeredAddress: selectedCriminal.address,
      height: selectedCriminal.height.toString(),
      weight: selectedCriminal.weight.toString(),
      hairColor: selectedCriminal.hairColor,
      eyeColor: selectedCriminal.eyeColor
    });
  };
  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    crimeCategory,
    setCrimeCategory,
    results,
    selectedCriminal,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputPesel,
    setInputPesel,
    inputAge,
    setInputAge,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  usePoliceRegistry
};
