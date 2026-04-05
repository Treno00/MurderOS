import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { GameState } from "./GameState.js";
const GameContext = createContext(void 0);
const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
const GameProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isVictimPanelOpen, setIsVictimPanelOpen] = useState(false);
  const [isConnectionBoardOpen, setIsConnectionBoardOpen] = useState(false);
  const [playerBalance, setPlayerBalance] = useState(0);
  const [suspicion, setSuspicion] = useState(0);
  const [networkTrace, setNetworkTrace] = useState(0);
  const [cart, setCart] = useState([]);
  const [settings, setSettings] = useState({
    themeId: "AGENCY",
    nightMode: false,
    darkMode: true,
    sfxVolume: 50,
    autoFill: false,
    showDownloadBtn: false,
    highlightConsistency: false,
    noLoading: false,
    noDecoding: false,
    ignoreQuietHours: false
  });
  const getStartDate = () => {
    const now = /* @__PURE__ */ new Date();
    return new Date(2010, now.getMonth(), now.getDate(), 8, 0, 0);
  };
  const [gameTime, setGameTime] = useState(getStartDate());
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isActionTimePaused, setIsActionTimePaused] = useState(false);
  const passTimeMinutes = (minutes) => {
    setGameTime((prev) => {
      const nextDate = new Date(prev.getTime() + (minutes * 60000));
      GameState.processDeliveries(nextDate);
      GameState.processOrganDecay(0); // Optional decay skip for small minute bumps
      GameState.processOrganMarket(nextDate);
      GameState.processPoliceEvents(nextDate);
      return nextDate;
    });
  };

  useEffect(() => {
    if (timeSpeed === 0 || isActionTimePaused) return;
    const msPerTick = 6e4 * timeSpeed;
    const tickRate = 1e3;
    const interval = setInterval(() => {
      setGameTime((prev) => {
        const nextTime = prev.getTime() + msPerTick;
        const nextDate = new Date(nextTime);
        GameState.processDeliveries(nextDate);
        GameState.processOrganDecay(timeSpeed);
        GameState.processOrganMarket(nextDate);
        GameState.processPoliceEvents(nextDate);
        return nextDate;
      });
      setNetworkTrace((prev) => Math.max(0, prev - 0.5 * timeSpeed));
    }, tickRate);
    return () => clearInterval(interval);
  }, [timeSpeed, isActionTimePaused]);
  useEffect(() => {
    const root = document.documentElement;
    let mainColor = "#0ea5e9";
    switch (settings.themeId) {
      case "AGENCY":
        mainColor = "#0ea5e9";
        break;
      case "SOCIAL":
        mainColor = "#3b82f6";
        break;
      case "RESIDENT":
        mainColor = "#f97316";
        break;
      case "BANKING":
        mainColor = "#10b981";
        break;
      case "POLICE":
        mainColor = "#ef4444";
        break;
      case "MEDICAL":
        mainColor = "#f43f5e";
        break;
      case "TAX":
        mainColor = "#eab308";
        break;
      case "EDUCATION":
        mainColor = "#a855f7";
        break;
      case "FIELD":
        mainColor = "#06b6d4";
        break;
      case "MATRIX":
        mainColor = "#22c55e";
        break;
    }
    root.style.setProperty("--agency-main", mainColor);

    let rootFilters = [];
    
    if (!settings.darkMode) {
      rootFilters.push("invert(1) hue-rotate(180deg)");
      root.classList.add("light-mode");
    } else {
      root.classList.remove("light-mode");
    }

    if (settings.nightMode) {
      rootFilters.push("brightness(0.7) contrast(1.1) sepia(0.2)");
    }

    if (rootFilters.length > 0) {
      root.style.filter = rootFilters.join(" ");
    } else {
      root.style.filter = "none";
    }

    // Reset old body filter if any existed
    document.body.style.filter = "none";
  }, [settings.themeId, settings.nightMode, settings.darkMode]);
  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const toggleVictimPanel = () => setIsVictimPanelOpen((prev) => !prev);
  const toggleConnectionBoard = () => setIsConnectionBoardOpen((prev) => !prev);
  const setVictimPanelOpen = (isOpen) => setIsVictimPanelOpen(isOpen);
  const updateBalance = (amount) => setPlayerBalance((prev) => prev + amount);
  const setSpeed = (speed) => setTimeSpeed(speed);
  const addNetworkTrace = (amount) => {
    setNetworkTrace((prev) => Math.min(100, prev + amount));
  };
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };
  const clearCart = () => setCart([]);
  const buyCart = () => {
    const pendingItemsCount = GameState.getPendingDeliveries().reduce((acc, d) => {
      return acc + d.items.length;
    }, 0);
    const currentInv = GameState.getInventoryCount();
    const cartSlots = cart.reduce((acc, c) => {
      const isStackable = ["Amunicja", "Chemikalia", "Trucizny", "Leki", "Narkotyki"].includes(c.item.subcategory);
      if (isStackable) return acc + 1;
      return acc + c.quantity;
    }, 0);
    if (currentInv + pendingItemsCount + cartSlots > GameState.inventoryCapacity) {
      // alert("BRAK MIEJSCA W MAGAZYNIE (Uwzględniając dostawy w drodze)!");
      // return;
    }
    const totalCost = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    if (playerBalance < totalCost) {
      alert("BRAK \u015ARODK\xD3W!");
      return;
    }
    updateBalance(-totalCost);
    const itemsToDeliver = [];
    cart.forEach((cartItem) => {
      const item = cartItem.item;
      const isStackable = ["Amunicja", "Chemikalia", "Trucizny", "Leki", "Narkotyki"].includes(item.subcategory);
      if (isStackable) {
        let baseQty = 1;
        let unit = "szt.";
        if (item.tags.some((t) => t.includes("ml"))) unit = "ml";
        else if (item.tags.some((t) => t.includes("g"))) unit = "g";
        const qtyTag = item.tags.find((t) => t.includes("Ilo\u015B\u0107:"));
        if (qtyTag) baseQty = parseInt(qtyTag.split(":")[1].trim()) || 1;
        else if (item.name.includes("ml")) {
          const match = item.name.match(/(\d+)ml/);
          if (match) baseQty = parseInt(match[1]);
        }
        itemsToDeliver.push({
          instanceId: crypto.randomUUID(),
          marketId: item.id,
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          quantity: baseQty * cartItem.quantity,
          unit,
          condition: 100,
          isStackable: true,
          tags: item.tags,
          attackModes: item.attackModes
        });
      } else {
        for (let i = 0; i < cartItem.quantity; i++) {
          itemsToDeliver.push({
            instanceId: crypto.randomUUID(),
            marketId: item.id,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            quantity: 1,
            unit: "szt.",
            condition: 100,
            isStackable: false,
            tags: item.tags,
            attackModes: item.attackModes
          });
        }
      }
    });
    const deliveryDate = new Date(gameTime);
    deliveryDate.setHours(deliveryDate.getHours() + 24);
    GameState.addDelivery({
      id: crypto.randomUUID(),
      items: itemsToDeliver,
      arrivalDate: deliveryDate,
      totalValue: totalCost
    });
    setCart([]);
    alert(`ZAM\xD3WIENIE PRZYJ\u0118TE. KOSZT: ${totalCost} PLN. Dostawa do kryj\xF3wki za 24h.`);
  };
  return /* @__PURE__ */ jsx(GameContext.Provider, { value: {
    isNavOpen,
    toggleNav,
    isVictimPanelOpen,
    toggleVictimPanel,
    setVictimPanelOpen,
    isConnectionBoardOpen,
    toggleConnectionBoard,
    gameTime,
    timeSpeed,
    setSpeed,
    isActionTimePaused,
    setIsActionTimePaused,
    passTimeMinutes,
    playerBalance,
    updateBalance,
    suspicion,
    setSuspicion,
    networkTrace,
    addNetworkTrace,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    buyCart,
    settings,
    updateSettings
  }, children });
};
export {
  GameProvider,
  useGame
};
