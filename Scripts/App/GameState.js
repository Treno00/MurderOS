import { generateCitizens } from "../../Shared/PersonGenerator.js";
import { createEmptyVictim } from "./VictimFile.js";
import { dispatchDataTransfer, dispatchCloseFile } from "./events.js";
import { ORGAN_DEFINITIONS, CAR_MODELS, CAR_COLORS } from "../../Shared/database.js";
import { pick, random, generateCrimeEvent } from "../../Shared/utils.js";
class GameStateManager {
  static instance;
  citizens = [];
  deceasedCitizens = [];
  policeCases = [];
  carRentals = [];
  // Connection Board State
  boardNodes = [];
  boardEdges = [];
  // Hideout Storage
  hideoutStorage = { basement: [], fridge: [], garage: [] };
  // Dynamic Capacities
  fridgeCapacity = 5;
  inventoryCapacity = 10;
  basementCapacity = 1;
  garageCapacity = 2;
  // Inventory & Deliveries
  inventory = [];
  pendingDeliveries = [];
  // Temporary storage for citizen data during action phase
  recentDeceased = null;
  // Timers for generating cases
  nextMissingTime = null;
  nextWantedTime = null;
  nextInvestigationTime = null;
  // Victim Files State
  victimFiles = [createEmptyVictim()];
  activeVictimId = this.victimFiles[0].id;
  // Action Phase Loadout
  currentLoadout = { head: null, torso: null, legs: null, hands: null, feet: null };
  constructor() {
    this.citizens = generateCitizens(2500);
    for (let i = 0; i < 4; i++) {
      generateCrimeEvent(this.citizens);
    }
    for (let i = 0; i < 3; i++) {
      this.generateWantedEvent();
    }
    for (let i = 0; i < 2; i++) {
      this.generateInitialMurder();
    }
    this.generateCarRentals();
    this.inventory.push(
      {
        instanceId: crypto.randomUUID(),
        marketId: "w1",
        name: 'N\xF3\u017C Kuchenny "Szef"',
        category: "WEAPON",
        subcategory: "Bia\u0142a",
        quantity: 1,
        unit: "szt.",
        condition: 100,
        isStackable: false,
        attackModes: ["Ci\u0119cie", "Pchni\u0119cie"],
        tags: ["Ci\u0119te", "K\u0142ute", "Zasi\u0119g: Bardzo Ma\u0142y"]
      },
      {
        instanceId: crypto.randomUUID(),
        marketId: "w4",
        name: "Kij Baseballowy",
        category: "WEAPON",
        subcategory: "Bia\u0142a",
        quantity: 1,
        unit: "szt.",
        condition: 100,
        isStackable: false,
        attackModes: ["Zamach Obuchowy"],
        tags: ["Obuchowe", "Obalenie", "Wymaga Si\u0142y"]
      },
      {
        instanceId: crypto.randomUUID(),
        marketId: "w5",
        name: "Siekiera",
        category: "WEAPON",
        subcategory: "Bia\u0142a",
        quantity: 1,
        unit: "szt.",
        condition: 100,
        isStackable: false,
        attackModes: ["R\u0105banie", "Amputacja"],
        tags: ["R\u0105bi\u0105ce", "Ci\u0119te", "Masywne"]
      },
      {
        instanceId: crypto.randomUUID(),
        marketId: "w2",
        name: "Garota",
        category: "WEAPON",
        subcategory: "Bia\u0142a",
        quantity: 1,
        unit: "szt.",
        condition: 100,
        isStackable: false,
        attackModes: ["Duszenie"],
        tags: ["Dusz\u0105ce"]
      }
    );
  }
  static getInstance() {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }
  setLoadout(loadout) {
    this.currentLoadout = loadout;
  }
  getLoadout() {
    return this.currentLoadout;
  }
  // --- Capacity Upgrades ---
  upgradeCapacity(type) {
    switch (type) {
      case "INVENTORY":
        this.inventoryCapacity += 10;
        return true;
      case "BASEMENT":
        this.basementCapacity += 1;
        return true;
      case "FRIDGE":
        this.fridgeCapacity += 5;
        return true;
      default:
        return false;
    }
  }
  processOrganMarket(currentTime) {
  }
  getCitizens() {
    return this.citizens;
  }
  resolvePoliceStatus(id) {
    const citizen = this.citizens.find((c) => c.id === id);
    if (citizen) {
      citizen.policeStatus = "CZYSTY";
    }
  }
  getDeceasedCitizens() {
    return this.deceasedCitizens;
  }
  getAllCitizens() {
    return [...this.citizens, ...this.deceasedCitizens];
  }
  // --- Police Cases ---
  getPoliceCases() {
    return this.policeCases;
  }
  resolvePoliceCase(id) {
    this.policeCases = this.policeCases.map(c => c.id === id ? { ...c, status: "ROZWI\u0104ZANE" } : c);
  }
  // --- Hideout & Inventory & Fridge ---
  getHideoutStorage() {
    return this.hideoutStorage;
  }
  updateCaptiveState(id, updates) {
    const captive = this.hideoutStorage.basement.find((c) => c.id === id);
    if (captive) {
      Object.assign(captive, updates);
      if (captive.health > 100) captive.health = 100;
      if (captive.health < 0) captive.health = 0;
      if (captive.stress > 100) captive.stress = 100;
      if (captive.submission > 100) captive.submission = 100;
      if (captive.consciousness > 100) captive.consciousness = 100;
      if (captive.bloodML < 0) captive.bloodML = 0;
      captive.bloodML = Math.round(captive.bloodML * 10) / 10;
    }
  }
  getCurrentFridgeUsage() {
    return this.hideoutStorage.fridge.reduce((acc, item) => acc + item.slots, 0);
  }
  addOrganToFridge(organName, condition) {
    if (this.getCurrentFridgeUsage() >= this.fridgeCapacity) {
      console.warn("Lod\xF3wka pe\u0142na!");
      return false;
    }
    console.log(`Dodawanie organu do lod\xF3wki: ${organName}, stan: ${condition}`);
    this.hideoutStorage.fridge.push({
      id: crypto.randomUUID(),
      type: "ORGAN",
      name: `${organName} (${condition}%)`,
      organType: organName,
      condition,
      amount: 1,
      slots: 1
    });
    return true;
  }
  addBloodToFridge(bloodType, totalLiters) {
    let remaining = totalLiters;
    const packsToAdd = [];
    if (remaining <= 5) {
      packsToAdd.push(Number(remaining.toFixed(2)));
    } else {
      while (remaining > 0) {
        let packAmount = 5;
        if (remaining < 5) {
          packAmount = remaining;
        }
        packsToAdd.push(Number(packAmount.toFixed(2)));
        remaining -= packAmount;
      }
    }
    const slotsNeeded = packsToAdd.length;
    if (this.getCurrentFridgeUsage() + slotsNeeded > this.fridgeCapacity) {
      console.warn("Brak miejsca na krew w lod\xF3wce!");
      return false;
    }
    packsToAdd.forEach((amount) => {
      console.log(`Dodawanie krwi do lod\xF3wki: ${bloodType} ${amount}L`);
      this.hideoutStorage.fridge.push({
        id: crypto.randomUUID(),
        type: "BLOOD",
        name: `Krew ${bloodType} (${amount.toFixed(2)}L)`,
        bloodType,
        condition: 100,
        amount,
        slots: 1
      });
    });
    return true;
  }
  removeFridgeItem(id) {
    this.hideoutStorage.fridge = this.hideoutStorage.fridge.filter((i) => i.id !== id);
  }
  processOrganDecay(timeSpeed = 1) {
    this.hideoutStorage.fridge.forEach((item) => {
      if (item.type === "ORGAN" && item.organType) {
        const definition = ORGAN_DEFINITIONS[item.organType];
        const baseDecay = definition ? definition.decayFridge : 0.017;
        const decayAmount = baseDecay * timeSpeed;
        item.condition = Math.max(0, parseFloat((item.condition - decayAmount).toFixed(4)));
        item.name = `${item.organType} (${item.condition.toFixed(1)}%)`;
      }
    });
  }
  removeBodyFromBasement(id) {
    this.hideoutStorage.basement = this.hideoutStorage.basement.filter((b) => b.id !== id);
  }
  getInventory() {
    return this.inventory;
  }
  addDelivery(delivery) {
    this.pendingDeliveries.push(delivery);
  }
  getPendingDeliveries() {
    return this.pendingDeliveries;
  }
  processDeliveries(currentTime) {
    let updated = false;
    const arrived = this.pendingDeliveries.filter((d) => d.arrivalDate.getTime() <= currentTime.getTime());
    if (arrived.length > 0) {
      arrived.forEach((delivery) => {
        delivery.items.forEach((item) => this.addItemToInventory(item));
      });
      this.pendingDeliveries = this.pendingDeliveries.filter((d) => d.arrivalDate.getTime() > currentTime.getTime());
      updated = true;
    }
    return updated;
  }
  getInventoryCount() {
    return this.inventory.length;
  }
  
  consumeItemFromInventory(marketId, amount) {
    const itemIndex = this.inventory.findIndex(i => i.marketId === marketId);
    if (itemIndex !== -1) {
      if (this.inventory[itemIndex].quantity > amount) {
         this.inventory[itemIndex].quantity -= amount;
         return true;
      } else if (this.inventory[itemIndex].quantity === amount) {
         this.inventory.splice(itemIndex, 1);
         return true;
      }
    }
    return false;
  }
  
  addItemToInventory(item) {
    if (item.isStackable) {
      const existing = this.inventory.find((i) => i.marketId === item.marketId);
      if (existing) {
        existing.quantity += item.quantity;
        return true;
      } else {
        // if (this.inventory.length >= this.inventoryCapacity) return false;
        this.inventory.push(item);
        return true;
      }
    } else {
      // if (this.inventory.length >= this.inventoryCapacity) return false;
      this.inventory.push(item);
      return true;
    }
  }

  addVehicleToGarage(vehicle) {
    if ((this.hideoutStorage.garage || []).length >= (this.garageCapacity || 2)) {
      return false; // Garage full
    }
    
    if (!this.hideoutStorage.garage) {
      this.hideoutStorage.garage = [];
    }

    this.hideoutStorage.garage.push({
      ...vehicle,
      instanceId: crypto.randomUUID(),
      condition: 100 // default condition
    });
    
    return true;
  }
  // --- Action Phase Logic ---
  markCitizenAsDeceased(targetId) {
    const index = this.citizens.findIndex((c) => c.id === targetId);
    if (index !== -1) {
      const victim = this.citizens[index];
      victim.alive = false;
      victim.bodyFound = false;
      this.deceasedCitizens.push(victim);
      this.citizens.splice(index, 1);
      this.recentDeceased = victim;
      const fileIdx = this.victimFiles.findIndex((v) => v.pesel === victim.pesel);
      if (fileIdx !== -1) {
        this.victimFiles[fileIdx].isDead = true;
        dispatchDataTransfer({ isDead: true });
      }
    }
  }
  markCitizenAsKidnapped(targetId, vitals) {
    const index = this.citizens.findIndex((c) => c.id === targetId);
    if (index !== -1) {
      const victim = this.citizens[index];
      victim.alive = true;
      victim.bodyFound = false;
      victim.policeStatus = "ZAGINIONY";
      this.citizens.splice(index, 1);
      this.recentDeceased = victim;
      this.recentDeceasedVitals = vitals;
    }
  }
  closeCaseAfterDeath(targetId) {
    const victim = this.deceasedCitizens.find((c) => c.id === targetId) || this.recentDeceased;
    if (victim && victim.pesel) {
      dispatchCloseFile(victim.pesel);
      this.victimFiles = this.victimFiles.filter((v) => v.pesel !== victim.pesel);
      if (this.victimFiles.length === 0) {
        this.victimFiles = [createEmptyVictim()];
        this.activeVictimId = this.victimFiles[0].id;
      } else if (this.getActiveVictim()?.pesel === victim.pesel) {
        this.activeVictimId = this.victimFiles[0].id;
      }
    }
  }
  finalizeBodyDisposal(method, gameDateStr, vitals) {
    if (!this.recentDeceased) return;
    const victim = this.recentDeceased;
    let bodyFound = false;
    let notes = "Zgłoszenie o znalezieniu zwłok.";

    if (method === "TRANSPORT") {
      if (this.hideoutStorage.basement.length < this.basementCapacity) {
        this.hideoutStorage.basement.push({
          id: victim.id,
          name: `${victim.firstName} ${victim.lastName}`,
          pesel: victim.pesel,
          age: victim.age,
          dateStored: gameDateStr,
          health: vitals && vitals.isDead ? 0 : 100,
          consciousness: vitals ? vitals.consciousness : 0,
          stress: 100,
          submission: 0,
          bloodML: vitals ? Math.round(vitals.bloodVolume * 1e3) : 5e3,
          isBleeding: false,
          isDrainingBlood: false,
          removedOrgans: [],
          isMuted: vitals ? vitals.isMuted : false,
          isBlinded: vitals ? vitals.isBlinded : false,
          isDeafened: vitals ? vitals.isDeafened : false,
          bloodType: victim.bloodType,
          diseases: victim.diseases,
          addictions: victim.addictions
        });
        bodyFound = false;
        notes = "Zgłoszenie zaginięcia wektorowego bez odnalezienia ciała.";
      } else {
        bodyFound = true;
        notes = "Ciało porzucone w wektorze z powodu braku pojemności przechowalniczej kryjówki.";
      }
    } else if (method === "LEAVE") {
      bodyFound = true;
      notes = "Ciało brutalnie pozostawione na miejscu zbrodni w widocznym stanie.";
    } else if (method === "FRAGMENTATION_BURN") {
      bodyFound = true;
      notes = "Znaleziono spalone do cna fragmenty ludzkiej biomasy w odległej lokacji. Ewidentne zacieranie śladów morderstwa.";
    } else if (method === "ACID") {
      bodyFound = true;
      notes = "Znaleziono gigantyczną plamę trujących opadów i mas ludzkich stanowiących pośmiertną maź, zidentyfikowano to jako zgon kwasowy.";
    } else if (method === "BAG_BURY" || method === "FRAGMENTATION_BURY") {
      bodyFound = false;
      notes = "Zgłoszono twarde zaginięcie po wielu braku ustaleń. Ciało całkowicie nieodnalezione.";
    }

    const deadIndex = this.deceasedCitizens.findIndex((c) => c.id === victim.id);
    if (deadIndex !== -1) {
      this.deceasedCitizens[deadIndex].bodyFound = bodyFound;
    }
    
    // Uruchomienie policji / zaginionych (ustala na podstawie zmiennej bodyFound)
    this.createPoliceCase(victim, bodyFound, gameDateStr, notes, method, vitals);
    
    this.recentDeceased = null;
    this.recentDeceasedVitals = null;
  }
  generateCaseId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  createPoliceCase(victim, bodyFound, dateStr, notes, method, vitals) {
    const reporters = ["Anonimowy rozm\xF3wca", "S\u0105siad z naprzeciwka", "Przechodzie\u0144", "Patrol interwencyjny", "Rodzina ofiary"];
    const reporter = pick(reporters);
    const timeReported = dateStr.split(" ")[1];
    let policeReport = "";
    if (bodyFound) {
      policeReport = `OSOBA zg\u0142aszaj\u0105ca: ${reporter}. O godzinie ${timeReported} wp\u0142yn\u0119\u0142o zawiadomienie o znalezieniu cia\u0142a w lokalizacji ${victim.city}, ${victim.address}. Patrol przyby\u0142y na miejsce o 22:15 potwierdzi\u0142 zgon. Miejsce zdarzenia zabezpieczono ta\u015Bm\u0105. Wezwano technika kryminalistyki i prokuratora.`;
    } else {
      policeReport = `OSOBA zg\u0142aszaj\u0105ca: ${reporter}. O godzinie ${timeReported} zg\u0142oszono zagini\u0119cie obywatela ${victim.firstName} ${victim.lastName}. Ostatni raz widziany w miejscu zamieszkania. Brak kontaktu telefonicznego. Wst\u0119pne ogl\u0119dziny miejsca zamieszkania sugeruj\u0105 mo\u017Cliwo\u015B\u0107 pope\u0142nienia przest\u0119pstwa.`;
    }
    const traces = [];
    if (method === "LEAVE") {
      traces.push("Du\u017Ca ilo\u015B\u0107 krwi na pod\u0142odze (Grupa " + victim.bloodType + ")");
      traces.push("\u015Alady walki, przewr\xF3cone meble");
      traces.push("Odciski but\xF3w typu wojskowego");
    } else if (method === "ACID") {
      traces.push("Silny zapach chemikali\xF3w");
      traces.push("Nadtopione fragmenty odzie\u017Cy");
      traces.push("\u015Alady wleczenia");
    } else if (method === "BURIAL") {
      traces.push("\u015Awie\u017Co wzruszona ziemia");
      traces.push("\u015Alady opon samochodu osobowego");
    } else if (method === "FRAGMENTATION") {
      traces.push("Znaleziono \u015Blady makabrycznego pofragmentowania cia\u0142a");
    } else {
      traces.push("Brak wyra\u017Anych \u015Blad\xF3w walki");
      traces.push("Zamek w drzwiach nienaruszony");
    }
    
    let randomWeapon = null;
    if (victim.kidnapperId) {
      const allPeople = [...this.citizens, ...this.deceasedCitizens];
      const perpetrator = allPeople.find(c => c.id === victim.kidnapperId);
      if (perpetrator) {
        if (Math.random() < 0.25) {
          traces.push(`Znaleziono w\u0142os ofiary/sprawcy. Badania wskazuj\u0105 na kolor: ${perpetrator.hairColor}`);
        }
        if (Math.random() < 0.10) {
          traces.push(`\u015Alady krwi poboczne na miejscu zbrodni. Prawdopodobnie sprawcy. Grupa: ${perpetrator.bloodType}`);
        }
        if (Math.random() < 0.50) {
           if (perpetrator.vehicle) {
              const modelParts = perpetrator.vehicle.split(' ');
              const model = modelParts.length > 1 ? modelParts.slice(1).join(' ') : perpetrator.vehicle;
              traces.push(`Zabezpieczono \u015Blady opon / nagrania z kamer w okolicy. Mo\u017Cliwy pojazd sprawcy: ${model}`);
           } else {
              traces.push(`Zabezpieczono nagrania z monitoringu: sprawca najpewniej oddali\u0142 si\u0119 pieszo lub komunikacj\u0105 miejsk\u0105.`);
           }
        }
        
        const DB_WEAPONS = ['N\xF3\u017C Kuchenny', 'Garota', 'M\u0142otek', 'Kij Bejsbolowy', 'Siekiera', '\u0141om', 'Katana', 'Maczeta', 'Pistolet z T\u0142umikiem', 'Kusza', 'Karabin Snajperski'];
        randomWeapon = DB_WEAPONS[Math.floor(Math.random() * DB_WEAPONS.length)];
        traces.push(`Prawdopodobne narz\u0119dzie zbrodni: ${randomWeapon}`);
      }
    }
    
    let autopsy = "";
    if (bodyFound) {
      autopsy = `AUT0PSJA NR ${random(1e3, 9999)}/26.
`;
      
      let cause = vitals?.causeOfDeath || "Oczekuje na wniosek po szczeg\xF3\u0142owych analizach";
      if (vitals?.decapitated) cause = "Dekapitacja Czuciowa i Anatomiczna";
      
      autopsy += `Przyczyna zgonu (Wst\u0119pna): ${cause}.
`;
      autopsy += `Czas zgonu: ok. ${dateStr}.
`;
      if (victim.addictions.length > 0) {
        autopsy += `Toksykologia: Wykryto \u015Blady substancji (${victim.addictions.join(", ")}).
`;
      } else {
        autopsy += `Toksykologia: Negatywna.
`;
      }

      if (vitals?.externalBloodLoss > 0 || vitals?.internalBloodLoss > 0) {
        autopsy += `\nANALIZA HIPOWOLEMII (Utrata Krwi):
`;
        autopsy += `- Szacowana utrata krwi (zewn\u0119trzna): ${Math.round(vitals.externalBloodLoss || 0)} ml
`;
        autopsy += `- Szacowana utrata krwi (wewn\u0119trzna): ${Math.round(vitals.internalBloodLoss || 0)} ml
`;
        if ((vitals.externalBloodLoss || 0) + (vitals.internalBloodLoss || 0) > 2000) {
           autopsy += `- WNIOSEK: Wyst\u0105pi\u0142 wstrz\u0105s krwotoczny IV stopnia. Wykrwawienie jako g\u0142\xF3wny lub wa\u017Cny czynnik zgonu.
`;
        }
      }

      autopsy += `\nObra\u017Cenia Anatomopatologiczne:
`;
      
      if (vitals?.sustainedInjuries && vitals.sustainedInjuries.length > 0) {
        vitals.sustainedInjuries.forEach((injury, index) => {
           let logText = injury.replace(/^\[\d+:\d+\]\s*/, '');
           autopsy += `- ${logText}
`;
        });
      } else {
         if (randomWeapon) {
             let damageDetails = "";
             let formalCause = "Uraz krytyczny lub wykrwawienie";
             const woundsCount = Math.floor(Math.random() * 8) + 2;
             
             if (['N\xF3\u017C Kuchenny', 'Katana', 'Maczeta'].includes(randomWeapon)) {
                  damageDetails = `Stwierdzono ${woundsCount} ran k\u0142uto-ci\u0119tych obr\u0119bu tu\u0142owia i ko\u0144czyn. G\u0142\u0119boko\u015B\u0107 kana\u0142\xF3w rany od 3 do 12 cm. Uszkodzenia tkanki mi\u0105\u017Cszowej, zewn\u0119trzne obra\u017Cenia obronne przedramion.`;
                  formalCause = "Rozleg\u0142y wprowadzaj\u0105cy w wstrz\u0105s krwotok wewn\u0119trzny i zewn\u0119trzny z mnogich ran ci\u0119tych.";
             } else if (['M\u0142otek', 'Kij Bejsbolowy', '\u0141om'].includes(randomWeapon)) {
                  damageDetails = `Stwierdzono ${woundsCount} rozleg\u0142ych ran t\u0142uczonych i t\u0142uczenno-dartych w okolicach g\u0142owy i klatki piersiowej. Wg\u0142obienia fragment\xF3w kostnych w tkank\u0119 m\xF3zgow\u0105. Wypadni\u0119cie z\u0119b\xF3w trzonowych.`;
                  formalCause = "Masywny uraz czaszkowo-m\xF3zgowy prowadz\u0105cy do zatrzymania czynno\u015Bci pnia m\xF3zgu.";
             } else if (['Garota'].includes(randomWeapon)) {
                  damageDetails = `Na asymetrycznej wysokiej linii szyi wyra\u017Ana bruzda dusz\u0105ca (grubo\u015B\u0107 ok. 2-5mm, typowa dla cienkich splot\xF3w drucianych/linkowych). Podbiegni\u0119cia krwawe w mi\u0119\u015Bniach g\u0142\u0119bokich szyi, z\u0142amanie trzonu i ro\u017Ck\xF3w ko\u015Bci gnykowej. Zasinienie ust.`;
                  formalCause = "Asfiksja \u2013 uduszenie gwa\u0142towne w mechanizmie zadzierzgni\u0119cia narz\u0119dziem r\u0119cznym.";
             } else if (['Siekiera'].includes(randomWeapon)) {
                  damageDetails = `Ujawniono ${woundsCount} niesymetrycznych r\u0105banych, ostrych zr\u0105b\xF3w mi\u0119\u015Bniowo-kostnych. Szerokie naci\u0119cia ods\u0142aniaj\u0105ce opony m\xF3zgowe oraz kr\u0119gos\u0142up w linii karku. Typowe dla ekstremalnej brutalno\u015Bci morderczej ("overkill").`;
                  formalCause = "Szok pourazowy i zniszczenie strategicznych funkcji merytorycznych O\u015AN. Wieloogniskowa rze\u017A tkankowa.";
             } else if (['Pistolet z T\u0142umikiem', 'Karabin Snajperski'].includes(randomWeapon)) {
                  damageDetails = `Stwierdzono punktowe rany postrza\u0142owe (wlotowe) z obecno\u015Bci\u0105 aureoli osmale\u0144 lub obr\u0105czki zabrudzenia. Kana\u0142 pocisku prostopad\u0142o dr\u0105\u017C\u0105cy klatk\u0119 u\u015Bwiadamia celowy, precyzyjny wymier z odleg\u0142o\u015Bci. T\u0142umik spowodowa\u0142 zmniejszenie energii balistycznej, chocia\u017C wystarczy\u0142o to na naruszenie serca.`;
                  formalCause = "Przebicie mi\u0119\u015Bnia sercowego b\u0105d\u017A p\u0142uc w wyniku bezpo\u015Bredniej penetracji cia\u0142a obcego.";
             } else if (['Kusza'].includes(randomWeapon)) {
                  damageDetails = `Odnaleziono ran\u0119 bez widocznej r\xF3\u017Cyczki prochowej, co wyklucza bro\u0144 paln\u0105. P\u0142aski i romboidalny kana\u0142 o d\u0142ugo\u015Bci do 20cm precyzyjnie usytuowany. Pozostawione resztki drewna / w\u0142\xF3kna w otarciu brzeg\xF3w wlotu.`;
                  formalCause = "Powa\u017Cny krwotok mi\u0119dzyop\u0142ucnowy wskutek rany mechanicznej zadanej za pomoc\u0105 ci\u0119ciwowej amunicji (najprawdopodobniej be\u0142t).";
             }
             
             let diseaseNote = "";
             if (victim.diseases && victim.diseases.length > 0) {
                  diseaseNote = `\nUWAGA PATOLOGA: Badanie per-mortem ujawni\u0142o udokumentowane aktywne choroby ofiary:\n[ ${victim.diseases.join(' | ')} ]. `;
                  if (victim.diseases.includes("Nadci\u015Bnienie") || victim.diseases.includes("Niewydolno\u015B\u0107 serca") || victim.diseases.includes("Zawa\u0142") || victim.diseases.includes("Arytmia")) {
                     diseaseNote += "Sekcja kardiologiczna potwierdza pot\u0119\u017Cny stres oksydacyjny wywo\u0142uj\u0105cy towarzysz\u0105cy zawa\u0142 w ostrych sekundach ataku.";
                  } else if (victim.diseases.includes("Cukrzyca Typ 2") || victim.diseases.includes("Cukrzyca Typ 1")) {
                     diseaseNote += "Kwasica metaboliczna we krwii oraz zaburzona krzepliwo\u015B\u0107 obwodowa nasili\u0142a wstrz\u0105s, uniemo\u017Cliwiaj\u0105c domkni\u0119cie si\u0119 rzazu naczy\u0144 tkankowych.";
                  } else if (victim.diseases.includes("Oty\u0142o\u015B\u0107") || victim.diseases.includes("Astma")) {
                     diseaseNote += "Wskazania spirometryczne potwierdzaj\u0105 nisk\u0105 rezerw\u0119 wiat\u0142ow\u0105 i og\xF3ln\u0105 dysfunkcj\u0119 ruchow\u0105 w ucieczce wzgl\u0119dem agresora.";
                  } else {
                     diseaseNote += "Znaleziono powi\u0119kszone w\u0119z\u0142y lub os\u0142abienie strukturalne ko\u015B\u0107ca wt\xF3rne wobec proces\xF3w dystroficznych organizmu w starciu bezpo\u015Brednim.";
                  }
             }
             
             autopsy += `- ${damageDetails}\n- Wniskowana bezpo\u015Brednia przyczyna zgonu (konkluzja): ${formalCause}${diseaseNote}\n`;
         } else {
             autopsy += `- Przeprowadzono ogl\u0119dziny. Nag\u0142y zgon z nie do ko\u0144ca jasnych zewn\u0119trznych przes\u0142anek mechanicznych. Wi\u0119kszo\u015B\u0107 tkanek bez ubytk\xF3w.\n`;
         }
      }
      
      // Additional notes explicitly dependent on disposal method
      if (method === "BURN") {
         autopsy += `
UWAGA: ZWŁOKI ZNALEZIONE W STANIE GŁĘBOKIEGO ZWĘGLENIA. ID DNA silnie utrudniona.`;
      } else if (method === "FRAGMENTATION") {
         autopsy += `
UWAGA: CIAŁO FRAGMENTOWANE. Brakuje kluczowych struktur kostnych.`;
      }
    } else {
      autopsy = "BRAK CIA\u0141A DO BADANIA. Wykonano wirtualną rezerwację teczki autopsji na wniosek techników ze śladów biologicznych i zapachowych.";
    }
    const newCase = {
      id: this.generateCaseId(),
      victimName: `${victim.firstName} ${victim.lastName}`,
      victimPesel: victim.pesel,
      victimAge: victim.age,
      victimCity: victim.city,
      dateOfCrime: dateStr,
      status: "OTWARTE",
      bodyFound,
      policeReportContent: policeReport,
      sceneTraces: traces,
      autopsyReport: autopsy,
      victimDetails: {
        gender: victim.gender,
        occupation: victim.jobTitle,
        address: victim.address
      }
    };
    this.policeCases.push(newCase);
  }
  getVictimFiles() {
    return this.victimFiles;
  }
  setVictimFiles(files) {
    this.victimFiles = files;
  }
  getActiveVictimId() {
    return this.activeVictimId;
  }
  setActiveVictimId(id) {
    this.activeVictimId = id;
  }
  getActiveVictim() {
    return this.victimFiles.find((v) => v.id === this.activeVictimId);
  }
  generateWantedEvent() {
    const potential = this.citizens.filter((c) => c.policeStatus === "CZYSTY" && c.age > 18);
    if(potential.length === 0) return;
    const wanted = pick(potential);
    wanted.policeStatus = "POSZUKIWANY";
    wanted.reward = random(3000, 15000);
  }
  processPoliceEvents(currentTime) {
      if(!this.nextMissingTime) {
          const hours = random(15, 24);
          this.nextMissingTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }
      if(!this.nextWantedTime) {
          const hours = random(20, 30);
          this.nextWantedTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }
      if(!this.nextInvestigationTime) {
          const hours = random(24, 96);
          this.nextInvestigationTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }

      if (currentTime >= this.nextMissingTime) {
          generateCrimeEvent(this.citizens);
          const hours = random(15, 24);
          this.nextMissingTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }
      if (currentTime >= this.nextWantedTime) {
          this.generateWantedEvent();
          const hours = random(20, 30);
          this.nextWantedTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }
      if (currentTime >= this.nextInvestigationTime) {
          this.generateInitialMurder(currentTime);
          const hours = random(24, 96);
          this.nextInvestigationTime = new Date(currentTime.getTime() + hours*60*60*1000);
      }
  }
  transferToInvestigation(citizenId, dateStr) {
    const aliveIdx = this.citizens.findIndex(c => c.id === citizenId);
    let victim = null;
    if (aliveIdx !== -1) {
       victim = this.citizens[aliveIdx];
       victim.policeStatus = "CZYSTY"; // take off missing list
    } else {
       const deadIdx = this.deceasedCitizens.findIndex(c => c.id === citizenId);
       if (deadIdx !== -1) {
         victim = this.deceasedCitizens[deadIdx];
         if (victim.bodyFound) return; 
       }
    }
    if (!victim) return;
    this.createPoliceCase(victim, victim.bodyFound || false, dateStr, "Informacje z Agencji posunęły sprawę operacyjnie do przodu. Rozpoczęto oficjalne dochodzenie Policji.", "KIDNAP", null);
  }
  generateInitialMurder(currentTime = null) {
    let perpetrator = null;
    let victim = null;
    let attempts = 0;
    
    while (!perpetrator && attempts < 50) {
      attempts++;
      const potentialVictims = this.citizens.filter((c) => c.policeStatus === "CZYSTY" && c.age > 10);
      if (potentialVictims.length === 0) return;
      victim = pick(potentialVictims);
      const depth1Ids = victim.connections.map((c) => c.personId);
      
      const depth2Ids = [];
      depth1Ids.forEach((id) => {
        const person = this.citizens.find((c) => c.id === id);
        if (person) {
          person.connections.forEach((conn) => {
            if (conn.personId !== victim.id && !depth1Ids.includes(conn.personId)) {
              depth2Ids.push(conn.personId);
            }
          });
        }
      });
      
      const candidates = this.citizens.filter((c) => {
         if (c.city !== victim.city) return false; // Ścisły wymóg tego samego miasta
         
         const isConnection1 = depth1Ids.includes(c.id);
         const isConnection2 = depth2Ids.includes(c.id);
         const sameSchool = !!victim.schoolName && victim.schoolName !== "Brak" && c.schoolName === victim.schoolName;
         const sameWork = !!victim.companyName && victim.companyName !== "Brak" && c.companyName === victim.companyName;
  
         const sharesFavorite = (c.favorites?.club && c.favorites?.club === victim.favorites?.club) || 
                                (c.favorites?.bar && c.favorites?.bar === victim.favorites?.bar) ||
                                (c.favorites?.gym && c.favorites?.gym === victim.favorites?.gym) ||
                                (c.favorites?.restaurant && c.favorites?.restaurant === victim.favorites?.restaurant) ||
                                (c.favorites?.shop && c.favorites?.shop === victim.favorites?.shop);
         
         const worksAtFavorite = (c.companyName && victim.favorites?.club && c.companyName === victim.favorites?.club) || 
                                 (c.companyName && victim.favorites?.bar && c.companyName === victim.favorites?.bar) ||
                                 (c.companyName && victim.favorites?.gym && c.companyName === victim.favorites?.gym) ||
                                 (c.companyName && victim.favorites?.restaurant && c.companyName === victim.favorites?.restaurant) ||
                                 (c.companyName && victim.favorites?.shop && c.companyName === victim.favorites?.shop);
  
         return (isConnection1 || isConnection2 || sameSchool || sameWork || sharesFavorite || worksAtFavorite) && c.id !== victim.id && c.age > 16;
      });
  
      if (candidates.length > 0) {
        perpetrator = pick(candidates);
      }
    }
    
    if (!perpetrator) return; // Zabezpieczenie, jeśli po 50 próbach nie znaleziono idealnego dopasowania
    
    victim.kidnapperId = perpetrator.id;
    
    // Jedna z Lokalizacja GPS Oprawcy powinna być miejscem zbrodni czyli ostatnim miejscem Ofiary
    if (victim.gpsLocations && victim.gpsLocations.length > 0) {
      const crimeGps = victim.gpsLocations[victim.gpsLocations.length - 1];
      if (perpetrator.gpsLocations && perpetrator.gpsLocations.length > 0) {
        const insertIdx = random(0, perpetrator.gpsLocations.length - 1);
        perpetrator.gpsLocations[insertIdx] = crimeGps;
      }
    }
    
    const index = this.citizens.findIndex((c) => c.id === victim.id);
    if (index !== -1) {
      this.citizens.splice(index, 1);
      victim.alive = false;
      victim.bodyFound = true;
      this.deceasedCitizens.push(victim);
      let dateStr = "";
      if (currentTime) {
        dateStr = currentTime.toISOString().replace('T', ' ').substring(0, 16);
      } else {
        dateStr = `2023-10-${random(1, 28).toString().padStart(2, "0")} ${random(0, 23).toString().padStart(2, "0")}:${random(0, 59).toString().padStart(2, "0")}`;
      }
      const methods = ["LEAVE", "FRAGMENTATION", "BURN"];
      const method = pick(methods);
      const vitals = {
        isDead: true,
        consciousness: 0,
        bloodVolume: 0,
        isMuted: false,
        isBlinded: false,
        isDeafened: false,
        causeOfDeath: pick(["Wykrwawienie", "Uduszenie", "Uraz wielonarz\u0105dowy", "Rana postrza\u0142owa", "Zawa\u0142 serca (wywo\u0142any)"])
      };
      this.createPoliceCase(victim, true, dateStr, "Znaleziono zw\u0142oki.", method, vitals);
    }
  }
  generateCarRentals() {
    // Oblicz wynajmy dla żywych zaginionych oraz martwych ofiar z początkowych morderstw
    const initialVictims = this.deceasedCitizens.filter((c) => c.kidnapperId);
    const missingPersons = this.citizens.filter((c) => c.policeStatus === "ZAGINIONY").concat(initialVictims);
    
    missingPersons.forEach((missing) => {
      if (!missing.kidnapperId) return;
      const kidnapper = this.citizens.find((c) => c.id === missing.kidnapperId);
      if (kidnapper) {
        if (kidnapper.vehicle && Math.random() > 0.8) {
           // 20% szansy na użycie prywatnego samochodu u oprawcy
        } else {
          const carData = pick(CAR_MODELS);
          const color = pick(CAR_COLORS);
          const carModel = `${color} ${carData.name}`;
          const city = missing.currentCity || missing.city;
          const daysAgo = random(1, 5);
          const date = /* @__PURE__ */ new Date();
          date.setDate(date.getDate() - daysAgo);
          const dateStr = date.toISOString().split("T")[0];
          const returnDate = new Date(date);
          returnDate.setDate(returnDate.getDate() + random(7, 14));
          const returnDateStr = returnDate.toISOString().split("T")[0];
          const paymentMethod = Math.random() > 0.5 ? "Karta" : "Got\xF3wka";
          this.carRentals.push({
            id: crypto.randomUUID(),
            citizenId: kidnapper.id,
            citizenName: `${kidnapper.firstName} ${kidnapper.lastName.charAt(0)}.`,
            carModel,
            licensePlate: `W${pick(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"])}${random(1e4, 99999)}`,
            rentalDate: dateStr,
            returnDate: returnDateStr,
            status: "ZWR\xD3CONY",
            paymentMethod,
            city,
            bankClientId: kidnapper.bankClientId,
            phoneNumber: kidnapper.phoneNumber,
            bankName: kidnapper.bankName
          });
        }
      }
    });
    for (let i = 0; i < 300; i++) {
      const citizen = pick(this.citizens);
      if (!citizen) continue;
      const carData = pick(CAR_MODELS);
      const color = pick(CAR_COLORS);
      const carModel = `${color} ${carData.name}`;
      const city = citizen.city;
      const daysAgo = random(0, 30);
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split("T")[0];
      const returnDate = new Date(date);
      returnDate.setDate(returnDate.getDate() + random(1, 7));
      const returnDateStr = returnDate.toISOString().split("T")[0];
      const paymentMethod = Math.random() > 0.5 ? "Karta" : "Got\xF3wka";
      this.carRentals.push({
        id: crypto.randomUUID(),
        citizenId: citizen.id,
        citizenName: `${citizen.firstName} ${citizen.lastName.charAt(0)}.`,
        carModel,
        licensePlate: `W${pick(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"])}${random(1e4, 99999)}`,
        rentalDate: dateStr,
        returnDate: returnDateStr,
        city,
        bankClientId: citizen.bankClientId,
        paymentMethod,
        phoneNumber: citizen.phoneNumber,
        bankName: citizen.bankName
      });
    }
  }
}
const GameState = GameStateManager.getInstance();
export {
  GameState
};
