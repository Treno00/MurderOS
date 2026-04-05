import { useState, useMemo, useEffect } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useFaceNet = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analyzedFriendsIds, setAnalyzedFriendsIds] = useState(/* @__PURE__ */ new Set());
  const [analyzedMediaIds, setAnalyzedMediaIds] = useState(/* @__PURE__ */ new Set());

  useEffect(() => {
    if (settings.autoFill) {
      setFirstName(getAutofill(activeFile?.firstName));
      setLastName(getAutofill(activeFile?.lastName));
      setCity(getAutofill(activeFile?.city));
    }
  }, [activeFile?.id, settings.autoFill]);

  const results = useMemo(() => {
    if (!firstName && !lastName && !city) return [];
    return db.filter((p) => {
      const matchFirst = firstName ? p.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? p.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchCity = city ? p.city.toLowerCase().includes(city.toLowerCase()) : true;
      return matchFirst && matchLast && matchCity;
    });
  }, [db, firstName, lastName, city]);
  const handleAnalyzeFriends = (citizen) => {
    if (analyzedFriendsIds.has(citizen.id) || analyzingId === citizen.id) return;
    setAnalyzingId(citizen.id);
    const delay = settings.noLoading ? 0 : citizen.friendsCount * 10;
    setTimeout(() => {
      setAnalyzedFriendsIds((prev) => new Set(prev).add(citizen.id));
      setAnalyzingId(null);
    }, delay);
  };
  const handleAnalyzeMedia = (citizen) => {
    if (analyzedMediaIds.has(citizen.id) || analyzingId === citizen.id) return;
    setAnalyzingId(citizen.id);
    const delay = settings.noLoading ? 0 : 2e3;
    setTimeout(() => {
      setAnalyzedMediaIds((prev) => new Set(prev).add(citizen.id));
      setAnalyzingId(null);
    }, delay);
  };
  const handleDownload = (citizen) => {
    dispatchDataTransfer({
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      city: citizen.city,
      maritalStatus: citizen.relationshipStatus,
      mothersMaidenName: analyzedFriendsIds.has(citizen.id) ? citizen.mothersMaidenName : void 0,
      instaNetHandle: analyzedMediaIds.has(citizen.id) ? citizen.socialMedia.instaNetHandle : void 0,
      workLinkHandle: analyzedMediaIds.has(citizen.id) ? citizen.socialMedia.workLinkHandle : void 0
    });
  };
  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    results,
    handleDownload,
    handleAnalyzeFriends,
    handleAnalyzeMedia,
    analyzingId,
    analyzedFriendsIds,
    analyzedMediaIds,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useFaceNet
};
