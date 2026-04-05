import { useState, useMemo, useEffect } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useInstaNet = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [handle, setHandle] = useState(getAutofill(activeFile?.instaNetHandle));
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analyzedIds, setAnalyzedIds] = useState(/* @__PURE__ */ new Set());

  useEffect(() => {
    if (settings.autoFill) {
      setHandle(getAutofill(activeFile?.instaNetHandle));
    }
  }, [activeFile?.id, settings.autoFill]);

  const results = useMemo(() => {
    if (!handle) return [];
    return db.filter((p) => {
      const matchHandle = handle ? p.socialMedia.instaNetHandle.toLowerCase().includes(handle.toLowerCase()) : true;
      return matchHandle;
    });
  }, [db, handle]);
  const handleAnalyzeProfile = (citizen) => {
    if (analyzedIds.has(citizen.id) || analyzingId === citizen.id) return;
    setAnalyzingId(citizen.id);
    const delay = settings.noLoading ? 0 : 1500;
    setTimeout(() => {
      setAnalyzedIds((prev) => new Set(prev).add(citizen.id));
      setAnalyzingId(null);
    }, delay);
  };
  const handleDownload = (citizen) => {
    if (!analyzedIds.has(citizen.id)) return;
    dispatchDataTransfer({
      vehicle: citizen.vehicle,
      hairColor: citizen.hairColor,
      eyeColor: citizen.eyeColor,
      phoneNumber: citizen.phoneNumber,
      workLinkHandle: citizen.socialMedia.workLinkHandle
    });
  };
  return {
    handle,
    setHandle,
    results,
    handleDownload,
    handleAnalyzeProfile,
    analyzingId,
    analyzedIds,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useInstaNet
};
