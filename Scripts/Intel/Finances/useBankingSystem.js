import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useBankingSystem = () => {
  const { settings, addNetworkTrace, networkTrace } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [searchClientId, setSearchClientId] = useState(getAutofill(activeFile?.bankClientId));
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputBankClientId, setInputBankClientId] = useState("");
  const [inputBankName, setInputBankName] = useState("");
  const [authError, setAuthError] = useState("");
  const results = useMemo(() => {
    if (!searchClientId) return [];
    return db.filter((p) => {
      return p.bankClientId.includes(searchClientId);
    });
  }, [db, searchClientId]);
  const handleUnlockClick = (citizen) => {
    if (networkTrace >= 90) {
      alert("RYZYKO WYKRYCIA ZBYT WYSOKIE (90%+). ODZYSKAJ ANONIMOWO\u015A\u0106.");
      return;
    }
    setSelectedCitizen(citizen);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputBankClientId(getAutofill(activeFile?.bankClientId));
    setInputBankName(getAutofill(activeFile?.bankName));
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCitizen) return;
    const cleanClientId = inputBankClientId.trim();
    const cleanInputBankName = inputBankName.trim().toLowerCase();
    const targetBankName = selectedCitizen.bankName.toLowerCase();
    if (cleanClientId === selectedCitizen.bankClientId && cleanInputBankName === targetBankName) {
      setShowAuthModal(false);
      if (!settings.noDecoding) {
        setIsDecoding(true);
        setTimeout(() => {
          setIsDecoding(false);
          setIsUnlocked(true);
          addNetworkTrace(10);
        }, 3e3);
      } else {
        setIsUnlocked(true);
        addNetworkTrace(10);
      }
    } else {
      setAuthError("B\u0141\u0104D AUTORYZACJI: Nieprawid\u0142owe dane weryfikacyjne.");
      addNetworkTrace(5);
    }
  };
  const handleDownload = () => {
    if (!selectedCitizen || !isUnlocked) return;
    dispatchDataTransfer({
      accountNumber: selectedCitizen.bankAccount,
      accountBalance: selectedCitizen.accountBalance.toFixed(2).replace(".", ","),
      netIncome: selectedCitizen.netIncome.toFixed(2).replace(".", ","),
      cardNumber: selectedCitizen.creditCard,
      cardExpiry: selectedCitizen.cardExpiry,
      cardCVV: selectedCitizen.cardCvv,
      bankName: selectedCitizen.bankName,
      bankClientId: selectedCitizen.bankClientId
    });
  };
  return {
    searchClientId,
    setSearchClientId,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputBankClientId,
    setInputBankClientId,
    inputBankName,
    setInputBankName,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useBankingSystem
};
