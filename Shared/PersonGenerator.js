import {
  CITIES,
  MALE_NAMES,
  FEMALE_NAMES,
  LAST_NAMES,
  JOBS_DB,
  BANKS,
  HAIR_COLORS,
  EYE_COLORS,
  STREETS,
  CAR_MODELS,
  CAR_COLORS,
  DISEASES,
  ADDICTIONS,
  PSYCH_TRAITS_PAIRS,
  CRIMES_MINOR,
  CRIMES_MAJOR,
  SCHOOL_TYPES,
  SHOPS,
  BARS,
  CLUBS,
  GYMS,
  RESTAURANTS,
  HOBBIES
} from "./database.js";
import { generatePESEL, generateBankAccount, generateVisaNumber, pick, random, generateBirthDate, generateTransactions, generateCoordinates } from "./utils.js";
import { generateWeeklyRoutine } from "./Routine.js";
const createBaseCitizen = () => {
  const gender = Math.random() > 0.5 ? "M\u0119\u017Cczyzna" : "Kobieta";
  const firstName = gender === "M\u0119\u017Cczyzna" ? pick(MALE_NAMES) : pick(FEMALE_NAMES);
  const lastName = pick(LAST_NAMES);
  const finalLastName = gender === "Kobieta" && lastName.endsWith("ki") ? lastName.replace("ki", "ka") : gender === "Kobieta" && lastName.endsWith("cki") ? lastName.replace("cki", "cka") : lastName;
  const motherBaseName = pick(LAST_NAMES);
  const mothersMaidenName = motherBaseName.endsWith("ki") ? motherBaseName.replace("ki", "ka") : motherBaseName.endsWith("cki") ? motherBaseName.replace("cki", "cka") : motherBaseName;
  const age = random(18, 70);
  const birthInfo = generateBirthDate(age);
  const pesel = generatePESEL(birthInfo.year, birthInfo.month, birthInfo.day, gender);
  const cityData = pick(CITIES);
  const city = cityData.name;
  const address = `ul. ${pick(STREETS)} ${random(1, 150)}/${random(1, 50)}`;
  let jobTitle = "";
  let companyName = "";
  let income = 0;
  let education = "Podstawowe";
  const isStudent = age >= 18 && age <= 20;
  let schoolName = "";
  let schoolAddress = "";
  let mainExamTitle = "Brak";
  let mainExamYear = "Brak";
  let mainExamGrade = "Brak";
  let extraExamTitle = "Brak";
  let extraExamYear = "Brak";
  let extraExamGrade = "Brak";
  const citySchools = cityData.schools || [`Zesp\xF3\u0142 Szk\xF3\u0142 w ${city}`, `Liceum Og\xF3lnokszta\u0142c\u0105ce w ${city}`, `Technikum w ${city}`];
  const cityWorkplaces = cityData.workplaces || [`Urz\u0105d Miasta ${city}`, `Galeria ${city}`, `Szpital Miejski w ${city}`, `Fabryka ${city}`];
  if (isStudent) {
    const schoolType = pick(SCHOOL_TYPES);
    jobTitle = `Ucze\u0144 (${schoolType})`;
    income = random(0, 500);
    education = "Podstawowe (w trakcie)";
    schoolName = pick(citySchools);
    schoolAddress = `ul. ${pick(STREETS)} ${random(1, 50)} (${city})`;
  } else {
    const jobDef = pick(JOBS_DB);
    const jobTitles = jobDef[0].split("|");
    jobTitle = gender === "M\u0119\u017Cczyzna" ? jobTitles[0] : jobTitles[1] || jobTitles[0];
    companyName = pick(jobDef[5]);
    income = random(jobDef[1], jobDef[2]);
    const gradYear = ((/* @__PURE__ */ new Date()).getFullYear() - (age - 19)).toString();
    if (jobTitle.includes("Lekarz") || jobTitle.includes("Prawnik") || jobTitle.includes("Programista") || jobTitle.includes("Architekt") || jobTitle.includes("Dyrektor") || income > 8e3) {
      education = "Wy\u017Csze";
      schoolName = pick(citySchools.filter((s) => s.includes("Uniwersytet") || s.includes("Politechnika") || s.includes("AGH") || s.includes("UAM")));
      if (!schoolName) schoolName = `Uniwersytet w ${city}`;
      schoolAddress = `ul. Akademicka ${random(1, 20)} (${city})`;
      mainExamTitle = "Dyplom Magisterski";
      mainExamYear = gradYear;
      mainExamGrade = pick(["4.0", "4.5", "5.0"]);
      extraExamTitle = "Licencjat";
      extraExamYear = (parseInt(gradYear) - 2).toString();
      extraExamGrade = pick(["4.0", "4.5"]);
    } else if (income > 4e3) {
      education = "\u015Arednie";
      schoolName = pick(citySchools.filter((s) => s.includes("Liceum") || s.includes("Technikum")));
      if (!schoolName) schoolName = `Liceum Og\xF3lnokszta\u0142c\u0105ce nr ${random(1, 20)}`;
      schoolAddress = `ul. Szkolna ${random(1, 50)} (${city})`;
      mainExamTitle = "Matura Podstawowa";
      mainExamYear = gradYear;
      mainExamGrade = pick(["70%", "85%", "92%"]);
      extraExamTitle = "Matura Rozszerzona";
      extraExamYear = gradYear;
      extraExamGrade = pick(["55%", "68%", "80%"]);
    } else {
      education = "Zawodowe";
      schoolName = pick(citySchools.filter((s) => s.includes("Technikum") || s.includes("Zesp\xF3\u0142")));
      if (!schoolName) schoolName = `Technikum Zawodowe nr ${random(1, 10)}`;
      schoolAddress = `ul. Warsztatowa ${random(1, 20)} (${city})`;
      mainExamTitle = "Egzamin Zawodowy";
      mainExamYear = gradYear;
      mainExamGrade = "Pozytywny";
    }
  }
  let livingAddress = address;
  let livingCity = city;
  if (Math.random() < 0.4) {
    const diffCity = Math.random() > 0.8;
    livingCity = diffCity ? pick(CITIES).name : city;
    livingAddress = `ul. ${pick(STREETS)} ${random(1, 150)}/${random(1, 50)}`;
  }
  let vehicle = "";
  if (!isStudent && income > 8000 && random(0, 100) > 10) {
    const car = pick(CAR_MODELS.filter(c => c.price >= 40000));
    const color = pick(CAR_COLORS);
    vehicle = `${color} ${car.name}`;
  } else if (!isStudent && income > 4000 && random(0, 100) > 20) {
    const car = pick(CAR_MODELS.filter(c => c.price >= 15000 && c.price < 40000));
    const color = pick(CAR_COLORS);
    vehicle = `${color} ${car.name}`;
  } else if (!isStudent && income >= 2500 && random(0, 100) > 40) {
    const car = pick(CAR_MODELS.filter(c => c.price < 15000));
    const color = pick(CAR_COLORS);
    vehicle = `${color} ${car.name}`;
  }
  let workAddress = "";
  let currentWorkAddress = "";
  let workCity = livingCity;
  if (isStudent) {
    workAddress = `ul. ${pick(STREETS)} ${random(1, 150)}`;
    currentWorkAddress = workAddress;
  } else if (income > 0) {
    if (vehicle && Math.random() < 0.2) {
      workCity = pick(CITIES.filter((c) => c.name !== livingCity)).name;
    }
    workAddress = `ul. ${pick(STREETS)} ${random(1, 200)}`;
    currentWorkAddress = workAddress;
  } else {
    workAddress = "Brak (Bezrobotny)";
    currentWorkAddress = workAddress;
  }
  let relationship = "Singiel";
  const relRoll = Math.random();
  if (isStudent) {
    if (relRoll > 0.8) relationship = "W zwi\u0105zku";
    else relationship = gender === "M\u0119\u017Cczyzna" ? "Singiel" : "Singielka";
  } else if (age > 25) {
    if (relRoll < 0.2) relationship = gender === "M\u0119\u017Cczyzna" ? "Singiel" : "Singielka";
    else if (relRoll < 0.6) relationship = gender === "M\u0119\u017Cczyzna" ? "\u017Bonaty" : "Zam\u0119\u017Cna";
    else if (relRoll < 0.8) relationship = gender === "M\u0119\u017Cczyzna" ? "Rozwiedziony" : "Rozwiedziona";
    else relationship = "W zwi\u0105zku";
  } else {
    relationship = Math.random() > 0.5 ? gender === "M\u0119\u017Cczyzna" ? "Singiel" : "Singielka" : "W zwi\u0105zku";
  }
  const height = gender === "M\u0119\u017Cczyzna" ? random(170, 200) : random(155, 180);
  const weight = gender === "M\u0119\u017Cczyzna" ? random(70, 110) : random(50, 80);
  const hair = pick(HAIR_COLORS);
  const eyes = pick(EYE_COLORS);
  const bankId = pick(Object.keys(BANKS));
  const bankName = BANKS[bankId];
  const bankAccount = generateBankAccount(bankId);
  const cardData = generateVisaNumber();
  const balance = income > 0 ? income * random(0.5, 12) : random(50, 2e3);
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
  const bloodType = pick(bloodTypes);
  const psychPair = pick(PSYCH_TRAITS_PAIRS);
  const psychProfile = pick(psychPair);

  const bmi = weight / Math.pow(height / 100, 2);
  let diseases = [];
  
  if (bmi >= 30) {
    if (Math.random() > 0.4) diseases.push("Oty\u0142o\u015B\u0107");
    if (Math.random() > 0.6) diseases.push("Nadci\u015Bnienie");
    if (Math.random() > 0.7) diseases.push(pick(["Cukrzyca Typ 2", "Niewydolno\u015B\u0107 serca", "B\xF3l plec\xF3w"]));
  } else if (bmi < 18.5) {
     if (Math.random() > 0.6) diseases.push("Anemia");
  }

  const genericDiseases = DISEASES.filter(d => !["Oty\u0142o\u015B\u0107", "Nadci\u015Bnienie", "Anemia", "Cukrzyca Typ 2", "Niewydolno\u015B\u0107 serca"].includes(d));
  if (Math.random() > 0.7 && diseases.length < 2) diseases.push(pick(genericDiseases));
  if (Math.random() > 0.9 && diseases.length < 2) diseases.push(pick(genericDiseases));

  let addictions = [];
  if (bmi >= 30 && Math.random() > 0.5) addictions.push("Jedzenie (Kompulsywne)");
  if (psychProfile === "Pracoholik" && Math.random() > 0.5) addictions.push("Praca");
  
  const genericAddictions = ADDICTIONS.filter(a => !["Jedzenie (Kompulsywne)", "Praca"].includes(a));
  if (Math.random() > 0.85) addictions.push(pick(genericAddictions));
  
  diseases = [...new Set(diseases)];
  addictions = [...new Set(addictions)];
  const fines = [];
  const sentences = [];
  if (Math.random() > 0.7) {
    const count = random(1, 3);
    for (let i = 0; i < count; i++) fines.push(pick(CRIMES_MINOR));
  }
  if (age > 16 && Math.random() > 0.9) {
    const count = random(1, 2);
    for (let i = 0; i < count; i++) sentences.push(pick(CRIMES_MAJOR));
  }
  let policeStatus = "CZYSTY";
  let reward = 0;
  const statusRoll = Math.random();
  if (statusRoll > 0.98) {
    policeStatus = "ZAGINIONY";
    reward = random(5e3, 5e4);
  } else if (statusRoll > 0.9 && sentences.length > 0) {
    policeStatus = "POSZUKIWANY";
    reward = random(1e4, 1e5);
  }
  const livesWith = relationship.includes("\u017Bona") || relationship.includes("M\u0105\u017C") || relationship.includes("Partner") ? "Partner" : "Samotnie";

  const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanLast = finalLastName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const faceNetId = `${firstName} ${finalLastName}`;
  const instaPrefixes = ["Slodki", "Wielki", "Mroczny", "Szczesliwy", "Smutny", "Szybki", "Zly", "Dobry", "Piekny", "Brzydki", "Cichy", "Glosny", "Tajemniczy", "Otwarty", "Zabawny", "Powazny"];
  const instaSuffixes = ["Kotka", "Samotnik", "Wilk", "Ptak", "Lis", "Niedzwiedz", "Orzel", "Sokol", "Tygrys", "Lew", "Pantera", "Pies", "Kot", "Mysz", "Szczur", "Krolik"];
  const instaNetHandle = `@${pick(instaPrefixes)}${pick(instaSuffixes)}${random(10, 99)}`;
  const workLinkHandle = `${firstName.charAt(0)}.${finalLastName}${birthInfo.year.toString().slice(-2)}`;
  const friendsCount = random(10, 500);
  const licensePlate = vehicle ? `W${pick(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"])}${random(1e4, 99999)}` : "";
  const bankClientId = random(1e7, 99999999).toString();
  const insuranceCompany = vehicle ? pick(["PZU", "Warta", "Allianz", "Link4", "Compensa", "Generali"]) : "";
  const phoneNumber = `+48 ${random(500, 899)} ${random(100, 999)} ${random(100, 999)}`;

  const hobbiesCount = random(1, 3);
  const hobbiesList = [];
  for(let i=0; i<hobbiesCount; i++) {
    const h = pick(HOBBIES);
    if (!hobbiesList.includes(h)) hobbiesList.push(h);
  }

  const favorites = {
    shop: pick(SHOPS),
    bar: pick(BARS),
    club: pick(CLUBS),
    gym: pick(GYMS),
    restaurant: pick(RESTAURANTS)
  };

  const transactions = generateTransactions(income, favorites, livingAddress);
  let routine = generateWeeklyRoutine(age, jobTitle, psychProfile, addictions, diseases, livesWith, favorites);

  return {
    id: crypto.randomUUID(),
    alive: true,
    bodyFound: false,
    firstName,
    lastName: finalLastName,
    mothersMaidenName,
    gender,
    age,
    birthDate: birthInfo.dateStr,
    city,
    address,
    livingCity,
    livingAddress,
    currentCity: livingCity,
    // Default to living city
    currentAddress: "",
    // Temporary
    phoneNumber,
    jobTitle,
    companyName,
    education,
    schoolName,
    schoolAddress,
    mainExamTitle,
    mainExamYear,
    mainExamGrade,
    extraExamTitle,
    extraExamYear,
    extraExamGrade,
    workCity,
    currentWorkAddress,
    workAddress,
    income,
    netIncome: Math.floor(income * 0.7),
    relationshipStatus: relationship,
    hairColor: hair,
    eyeColor: eyes,
    height,
    weight,
    pesel,
    socialMedia: {
      faceNetId,
      instaNetHandle,
      workLinkHandle
    },
    friendsCount,
    connections: [],
    // Initialize empty
    licensePlate,
    bankClientId,
    insuranceCompany,
    bankAccount,
    bankName,
    accountBalance: balance,
    creditCard: cardData.number,
    cardCvv: cardData.cvv,
    cardExpiry: cardData.expiry,
    transactions,
    vehicle,
    bloodType,
    diseases,
    addictions,
    psychologicalProfile: psychProfile,
    sentences,
    fines,
    policeStatus,
    reward,
    hobbies: hobbiesList,
    favorites,
    routine,
    gpsLocations: []
    // Temporary
  };
};
const generateCitizen = createBaseCitizen;
const generateCitizens = (count) => {
  const citizens = Array.from({ length: count }, () => createBaseCitizen());
  citizens.sort((a, b) => b.age - a.age);
  const isPartnered = (c) => c.connections.some((conn) => conn.type === "Rodzina" && (conn.relation === "Mąż" || conn.relation === "Żona" || conn.relation === "Partner" || conn.relation === "Partnerka"));
  for (let i = 0; i < citizens.length; i++) {
    const c1 = citizens[i];
    if (c1.age < 20 || isPartnered(c1)) continue;
    for (let j = i + 1; j < citizens.length; j++) {
      const c2 = citizens[j];
      if (c2.age < 20 || isPartnered(c2) || c2.city !== c1.city) continue;
      if (c1.gender !== c2.gender && Math.abs(c1.age - c2.age) <= 5) {
        const statusRoll = Math.random();
        let status = "W zwi\u0105zku";
        if (statusRoll > 0.6) status = c1.gender === "M\u0119\u017Cczyzna" ? "\u017Bonaty" : "Zam\u0119\u017Cna";
        c1.relationshipStatus = status;
        c2.relationshipStatus = c1.gender === "M\u0119\u017Cczyzna" ? status === "\u017Bonaty" ? "Zam\u0119\u017Cna" : "W zwi\u0105zku" : status === "Zam\u0119\u017Cna" ? "\u017Bonaty" : "W zwi\u0105zku";
        c2.livingAddress = c1.livingAddress;
        c2.address = c1.address;
        if (status === "\u017Bonaty" || status === "Zam\u0119\u017Cna") {
          if (c1.gender === "M\u0119\u017Cczyzna") {
            let newLast = c1.lastName;
            if (c1.lastName.endsWith("ski")) newLast = c1.lastName.replace(/ski$/, "ska");
            else if (c1.lastName.endsWith("cki")) newLast = c1.lastName.replace(/cki$/, "cka");
            else if (c1.lastName.endsWith("dzki")) newLast = c1.lastName.replace(/dzki$/, "dzka");
            c2.lastName = newLast;
          } else {
            let newLast = c2.lastName;
            if (c2.lastName.endsWith("ski")) newLast = c2.lastName.replace(/ski$/, "ska");
            else if (c2.lastName.endsWith("cki")) newLast = c2.lastName.replace(/cki$/, "cka");
            else if (c2.lastName.endsWith("dzki")) newLast = c2.lastName.replace(/dzki$/, "dzka");
            c1.lastName = newLast;
          }
        }
        c1.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: status === "\u017Bonaty" || status === "Zam\u0119\u017Cna" ? "Narzecze\u0144stwo" : "Partner", personId: c2.id, firstName: c2.firstName, lastName: c2.lastName });
        c2.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: status === "\u017Bonaty" || status === "Zam\u0119\u017Cna" ? "Narzecze\u0144stwo" : "Partner", personId: c1.id, firstName: c1.firstName, lastName: c1.lastName });
        break;
      }
    }
  }
  for (let i = citizens.length - 1; i >= 0; i--) {
    const child = citizens[i];
    if (child.age >= 25) break;
    if (isPartnered(child)) continue;
    const potentialParents = citizens.filter(
      (p) => p.city === child.city && p.age >= child.age + 20 && p.age <= child.age + 45 && (p.relationshipStatus === "\u017Bonaty" || p.relationshipStatus === "Zam\u0119\u017Cna" || p.relationshipStatus === "W zwi\u0105zku")
    );
    if (potentialParents.length > 0) {
      const parent = pick(potentialParents);
      const partnerConn = parent.connections.find((c) => c.type === "PARTNER");
      const partner = partnerConn ? citizens.find((c) => c.id === partnerConn.personId) : null;
      if (partner) {
        const father = parent.gender === "M\u0119\u017Cczyzna" ? parent : partner;
        const mother = parent.gender === "Kobieta" ? parent : partner;
        child.livingAddress = father.livingAddress;
        child.address = father.address;
        if (father.gender === "M\u0119\u017Cczyzna") {
          const baseName = father.lastName.replace(/(ski|cki)$/, "");
          if (child.gender === "M\u0119\u017Cczyzna") {
            child.lastName = father.lastName;
          } else {
            let newLast = father.lastName;
            if (father.lastName.endsWith("ski")) newLast = baseName + "ska";
            if (father.lastName.endsWith("cki")) newLast = baseName + "cka";
            child.lastName = newLast;
          }
        }
        child.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: "Rodzina", personId: father.id, firstName: father.firstName, lastName: father.lastName });
        father.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: "Rodzina", personId: child.id, firstName: child.firstName, lastName: child.lastName });
        child.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: "Rodzina", personId: mother.id, firstName: mother.firstName, lastName: mother.lastName });
        mother.connections.push({ id: crypto.randomUUID(), type: "Rodzina", relation: "Rodzina", personId: child.id, firstName: child.firstName, lastName: child.lastName });
      }
    }
  }
  const workGroups = {};
  const schoolGroups = {};
  citizens.forEach((c) => {
    if (c.workAddress && c.workAddress !== "Brak (Bezrobotny)") {
      if (!workGroups[c.workAddress]) workGroups[c.workAddress] = [];
      workGroups[c.workAddress].push(c);
    }
    if (c.schoolName && c.schoolName !== "Brak") {
      if (!schoolGroups[c.schoolName]) schoolGroups[c.schoolName] = [];
      schoolGroups[c.schoolName].push(c);
    }
  });
  Object.values(workGroups).forEach((group) => {
    if (group.length < 2) return;
    group.forEach((c1) => {
      const colleagues = group.filter((c) => c.id !== c1.id).sort(() => 0.5 - Math.random()).slice(0, random(1, 5));
      colleagues.forEach((c2) => {
        if (!c1.connections.some((conn) => conn.personId === c2.id)) {
          c1.connections.push({ id: crypto.randomUUID(), type: "Znajomi", relation: "Wsp\xF3\u0142pracownik", personId: c2.id, firstName: c2.firstName, lastName: c2.lastName });
          if (!c2.connections.some((conn) => conn.personId === c1.id)) {
            c2.connections.push({ id: crypto.randomUUID(), type: "Znajomi", relation: "Wsp\xF3\u0142pracownik", personId: c1.id, firstName: c1.firstName, lastName: c1.lastName });
          }
        }
      });
    });
  });
  Object.values(schoolGroups).forEach((group) => {
    if (group.length < 2) return;
    group.forEach((c1) => {
      const mates = group.filter((c) => c.id !== c1.id && Math.abs(c.age - c1.age) <= 2).sort(() => 0.5 - Math.random()).slice(0, random(1, 5));
      mates.forEach((c2) => {
        if (!c1.connections.some((conn) => conn.personId === c2.id)) {
          c1.connections.push({ id: crypto.randomUUID(), type: "Znajomi", relation: "Osoba ze szkoły", personId: c2.id, firstName: c2.firstName, lastName: c2.lastName });
          if (!c2.connections.some((conn) => conn.personId === c1.id)) {
            c2.connections.push({ id: crypto.randomUUID(), type: "Znajomi", relation: "Osoba ze szkoły", personId: c1.id, firstName: c1.firstName, lastName: c1.lastName });
          }
        }
      });
    });
  });
  citizens.forEach((c) => {
    c.policeStatus = "CZYSTY";
    c.reward = 0;
    c.kidnapperId = void 0;
  });
  citizens.forEach((c) => {
    const numGps = random(5, 9);
    c.gpsLocations = [];
    const roll = Math.random();
    if (roll < 0.4) c.currentAddress = c.livingAddress;
    else if (roll < 0.8 && c.workAddress && c.workAddress !== "Brak (Bezrobotny)") c.currentAddress = c.workAddress;
    else c.currentAddress = `ul. ${pick(STREETS)} ${random(1, 150)}/${random(1, 50)}`;
    c.currentCity = c.livingCity;
    const homeCoords = generateCoordinates(c.livingCity);
    c.gpsLocations.push(homeCoords);
    if (c.workAddress && c.workAddress !== "Brak (Bezrobotny)") {
      const workCoords = generateCoordinates(c.workCity);
      c.gpsLocations.push(workCoords);
    }
    while (c.gpsLocations.length < numGps) {
      c.gpsLocations.push(generateCoordinates(c.livingCity));
    }
    c.gpsLocations.sort(() => Math.random() - 0.5);
  });
  return citizens;
};
export {
  createBaseCitizen,
  generateCitizen,
  generateCitizens
};
