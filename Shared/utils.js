import { COMPANY_NAMES, CITIES, STREETS } from "./database.js";
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatTime = (h) => `${(h % 24).toString().padStart(2, "0")}:00`;
const generateCoordinates = (city, type = "urban") => {
  const cityData = CITIES.find((c) => c.name === city);
  const base = cityData?.coords || { lat: 52, lon: 19 };
  const spread = type === "urban" ? 0.05 : 0.15;
  const lat = base.lat + (Math.random() - 0.5) * spread;
  const lon = base.lon + (Math.random() - 0.5) * spread;
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
};
const getAddressForPlace = (placeName) => {
  if (!placeName) return "Nieznany adres";
  let hash = 0;
  for (let i = 0; i < placeName.length; i++) {
    hash = placeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const streetIndex = Math.abs(hash) % STREETS.length;
  const number = (Math.abs(hash) % 150) + 1;
  return `ul. ${STREETS[streetIndex]} ${number}`;
};
const generateBirthDate = (age) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const year = currentYear - age;
  const month = random(1, 12);
  const day = random(1, 28);
  const dd = day.toString().padStart(2, "0");
  const mm = month.toString().padStart(2, "0");
  const yyyy = year.toString();
  return {
    dateStr: `${dd}.${mm}.${yyyy}`,
    year,
    month,
    day
  };
};
const generateTransactions = (income, favorites, livingAddress) => {
  const count = random(3, 8);
  const transactions = [];
  if (income > 0) {
    transactions.push({
      id: `TX-${random(1e3, 9999)}`,
      date: "2023-10-10",
      recipient: "Przelew Wynagrodzenia",
      amount: Math.floor(income * 0.7),
      type: "incoming",
      encrypted: false
    });
  }
  
  if (livingAddress) {
    transactions.push({
      id: `TX-${random(1e3, 9999)}`,
      date: "2023-10-01",
      recipient: `Czynsz - Wspólnota ${livingAddress}`,
      amount: random(800, 2500),
      type: "outgoing",
      encrypted: false
    });
  }

  for (let i = 0; i < count; i++) {
    const amount = random(20, 500);
    let recipient = pick(COMPANY_NAMES);

    if (favorites) {
      const type = pick(["shop", "bar", "club", "gym", "restaurant", "generic"]);
      if (type !== "generic" && favorites[type]) {
        recipient = favorites[type];
      }
    }

    transactions.push({
      id: `TX-${random(1e4, 99999)}`,
      date: `2023-10-${random(11, 28)}`,
      recipient,
      amount,
      type: "outgoing",
      encrypted: Math.random() > 0.95
    });
  }
  return transactions.sort((a, b) => b.date.localeCompare(a.date));
};
const generatePESEL = (year, month, day, gender) => {
  const yy = year % 100;
  let mm = month;
  if (year >= 2e3) mm += 20;
  const rrStr = yy.toString().padStart(2, "0");
  const mmStr = mm.toString().padStart(2, "0");
  const ddStr = day.toString().padStart(2, "0");
  const rrmmdd = `${rrStr}${mmStr}${ddStr}`;
  const nnn = random(0, 999).toString().padStart(3, "0");
  let pDigit;
  if (gender === "Kobieta") {
    pDigit = pick([0, 2, 4, 6, 8]);
  } else {
    pDigit = pick([1, 3, 5, 7, 9]);
  }
  const raw = `${rrmmdd}${nnn}${pDigit}`;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(raw[i]) * weights[i];
  }
  const lastDigitOfSum = sum % 10;
  const controlDigit = (10 - lastDigitOfSum) % 10;
  return `${raw}${controlDigit}`;
};
const generateBankAccount = (bankId) => {
  const branchId = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
  const clientId = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
  const countryCodePL = "252100";
  const doObliczen = bankId + branchId + clientId + countryCodePL;
  const bigIntVal = BigInt(doObliczen);
  const mod = Number(bigIntVal % 97n);
  const kkVal = 98 - mod;
  const kkStr = kkVal.toString().padStart(2, "0");
  const raw = `${kkStr}${bankId}${branchId}${clientId}`;
  return raw.match(/.{1,4}/g)?.join(" ") || raw;
};
const generateVisaNumber = () => {
  const digits = [4];
  for (let i = 1; i < 15; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - sum % 10) % 10;
  digits.push(checkDigit);
  const raw = digits.join("");
  const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
  const cvv = random(100, 999).toString();
  const now = /* @__PURE__ */ new Date();
  const monthsToAdd = random(3, 54);
  now.setMonth(now.getMonth() + monthsToAdd);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const yy = (now.getFullYear() % 100).toString().padStart(2, "0");
  const expiry = `${mm}/${yy}`;
  return { number: formatted, cvv, expiry };
};
const generateCrimeEvent = (citizens) => {
  const potentialVictims = citizens.filter((c) => c.policeStatus === "CZYSTY" && c.age > 10);
  if (potentialVictims.length === 0) return;
  const victim = pick(potentialVictims);
  const depth1Ids = victim.connections.map((c) => c.personId);
  const depth2Ids = [];
  depth1Ids.forEach((id) => {
    const person = citizens.find((c) => c.id === id);
    if (person) {
      person.connections.forEach((conn) => {
        if (conn.personId !== victim.id && !depth1Ids.includes(conn.personId)) {
          depth2Ids.push(conn.personId);
        }
      });
    }
  });
  const candidateIds = [...depth1Ids, ...depth2Ids];
  const candidates = citizens.filter((c) => candidateIds.includes(c.id) && c.id !== victim.id && c.age > 16);
  let perpetrator;
  if (candidates.length > 0) {
    perpetrator = pick(candidates);
  } else {
    const locals = citizens.filter((c) => c.city === victim.city && c.id !== victim.id && c.age > 16);
    if (locals.length > 0) perpetrator = pick(locals);
    else return;
  }
  victim.policeStatus = "ZAGINIONY";
  victim.reward = random(2e3, 1e4);
  victim.kidnapperId = perpetrator.id;
  const hideouts = ["Opuszczony Magazyn", "Las", "Stara Fabryka", "Domek Letniskowy", "Pustostan", "Stara Szopa", "Opuszczony Szpital", "Wysypisko \u015Amieci", "Jezioro", "Pole"];
  victim.currentCity = pick(CITIES).name;
  victim.currentAddress = `${pick(hideouts)}`;
  const numGps = random(5, 9);
  const kidnapCoords = generateCoordinates(victim.livingCity);
  const hideoutCoords = generateCoordinates(victim.currentCity, "rural");
  victim.gpsLocations = [];
  for (let i = 0; i < numGps - 2; i++) {
    victim.gpsLocations.push(generateCoordinates(victim.livingCity));
  }
  victim.gpsLocations.push(kidnapCoords);
  victim.gpsLocations.push(hideoutCoords);
  const perpGpsBase = [];
  for (let i = 0; i < numGps - 2; i++) {
    perpGpsBase.push(generateCoordinates(perpetrator.livingCity));
  }
  const splitIdx = random(0, perpGpsBase.length);
  perpetrator.gpsLocations = [
    ...perpGpsBase.slice(0, splitIdx),
    kidnapCoords,
    hideoutCoords,
    ...perpGpsBase.slice(splitIdx)
  ];
  perpetrator.currentCity = perpetrator.livingCity;
  perpetrator.currentAddress = `ul. ${pick(STREETS)} ${random(1, 150)}/${random(1, 50)}`;
};
export {
  formatTime,
  getAddressForPlace,
  generateBankAccount,
  generateBirthDate,
  generateCoordinates,
  generateCrimeEvent,
  generatePESEL,
  generateTransactions,
  generateVisaNumber,
  pick,
  random
};
