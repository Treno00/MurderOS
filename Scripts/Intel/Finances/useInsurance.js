import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useInsurance = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [licensePlate, setLicensePlate] = useState(getAutofill(activeFile?.licensePlate));
  const initialVehicle = activeFile?.vehicle || "";
  const [carModel, setCarModel] = useState(getAutofill(initialVehicle ? initialVehicle.split(" ").slice(1).join(" ") : ""));
  const [carColor, setCarColor] = useState(getAutofill(initialVehicle ? initialVehicle.split(" ")[0] : ""));
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [inputVehicle, setInputVehicle] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState("");
  const results = useMemo(() => {
    if (!licensePlate && !carModel && !carColor && !city) return [];
    return db.filter((p) => {
      const matchPlate = licensePlate ? p.licensePlate && p.licensePlate.toLowerCase().includes(licensePlate.toLowerCase()) : true;
      const matchModel = carModel ? p.vehicle && p.vehicle.toLowerCase().includes(carModel.toLowerCase()) : true;
      const matchColor = carColor ? p.vehicle && p.vehicle.toLowerCase().includes(carColor.toLowerCase()) : true;
      const matchCity = city ? p.city && p.city.toLowerCase().includes(city.toLowerCase()) : true;
      return matchPlate && matchModel && matchColor && matchCity;
    });
  }, [db, licensePlate, carModel, carColor, city]);
  const handleUnlockClick = (citizen) => {
    setSelectedCitizen(citizen);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputVehicle(getAutofill(activeFile?.vehicle));
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCitizen) return;
    if (inputVehicle.trim().toLowerCase() === selectedCitizen.vehicle.toLowerCase()) {
      setShowAuthModal(false);
      if (!settings.noDecoding) {
        setIsDecoding(true);
        const delay = Math.floor(Math.random() * (3e3 - 1500 + 1) + 1500);
        setTimeout(() => {
          setIsDecoding(false);
          setIsUnlocked(true);
        }, delay);
      } else {
        setIsUnlocked(true);
      }
    } else {
      setAuthError("B\u0141\u0104D WERYFIKACJI POJAZDU.");
    }
  };
  const handleDownload = () => {
    if (!selectedCitizen || !isUnlocked) return;
    dispatchDataTransfer({
      insuranceCompany: selectedCitizen.insuranceCompany,
      bankClientId: selectedCitizen.bankClientId,
      bankName: selectedCitizen.bankName
    });
  };
  return {
    licensePlate,
    setLicensePlate,
    carModel,
    setCarModel,
    carColor,
    setCarColor,
    city,
    setCity,
    inputVehicle,
    setInputVehicle,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useInsurance
};
