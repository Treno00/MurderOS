import { JOBS_DB } from "./database.js";
import { random } from "./utils.js";
const DAYS = ["Poniedzia\u0142ek", "Wtorek", "\u015Aroda", "Czwartek", "Pi\u0105tek", "Sobota", "Niedziela"];
const getJobHours = (jobTitle) => {
  if (jobTitle.startsWith("Ucze\u0144")) return { start: 8, end: 15 };
  const jobEntry = JOBS_DB.find((j) => {
    const titles = j[0].split("|");
    return titles.includes(jobTitle) || jobTitle.includes(titles[0]);
  });
  if (jobEntry) {
    return { start: jobEntry[3], end: jobEntry[4] };
  }
  return null;
};
const formatTime = (h, m = 0) => {
  const hh = Math.floor(h).toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
};
const generateWeeklyRoutine = (age, jobTitle, traits, addictions, diseases, livingWith, favorites) => {
  const routine = {};
  const jobHours = getJobHours(jobTitle);
  const isReligious = traits.includes("Religijny");
  const isParty = traits.includes("Imprezowy");
  const isLoner = traits.includes("Domator");
  const isActive = traits.includes("Sportowiec") || jobTitle.includes("Trener");
  const hasDog = Math.random() > 0.7;
  DAYS.forEach((day) => {
    const events = [];
    const isWeekend = day === "Sobota" || day === "Niedziela";
    let wakeUpTime = 0;
    if (!isWeekend && jobHours) {
      wakeUpTime = Math.max(5, jobHours.start - random(1, 2));
    } else {
      wakeUpTime = random(8, 11);
    }
    events.push({
      time: formatTime(wakeUpTime),
      activity: "Pobudka",
      icon: "home"
    });
    if (hasDog) {
      events.push({
        time: formatTime(wakeUpTime, 30),
        activity: "Spacer z psem (Okolica)",
        icon: "leisure"
      });
    }
    if (!isWeekend && jobHours) {
      const commuteStart = jobHours.start - 0.5;
      events.push({
        time: formatTime(commuteStart),
        activity: "Wyj\u015Bcie / Dojazd",
        icon: "commute"
      });
      const activityName = jobTitle.startsWith("Ucze\u0144") ? "Zaj\u0119cia szkolne" : "Praca";
      events.push({
        time: `${formatTime(jobHours.start)} - ${formatTime(jobHours.end)}`,
        activity: `${activityName} (${jobTitle})`,
        icon: "work"
      });
      const returnTime = jobHours.end + 0.5;
      events.push({
        time: formatTime(returnTime),
        activity: "Powr\xF3t do domu",
        icon: "commute"
      });
      if (Math.random() > 0.6) {
        events.push({
          time: formatTime(returnTime + 0.5),
          activity: `Zakupy (${favorites.shop})`,
          icon: "shopping"
        });
      }
    } else if (!isWeekend && !jobHours) {
      events.push({
        time: formatTime(11, 0),
        activity: "Wyj\u015Bcie na miasto / Sprawy urz\u0119dowe",
        icon: "commute"
      });
      events.push({
        time: formatTime(14, 0),
        activity: "Powr\xF3t do domu",
        icon: "home"
      });
    }
    if (day === "Sobota") {
      events.push({
        time: formatTime(10, 0),
        activity: "Sprzątanie / Obowiązki domowe",
        icon: "home"
      });
      events.push({
        time: formatTime(13, 0),
        activity: `Większe zakupy (${favorites.shop})`,
        icon: "shopping"
      });
    }
    if (day === "Niedziela" && isReligious) {
      events.push({
        time: formatTime(9, 30),
        activity: "Wyj\u015Bcie do ko\u015Bcio\u0142a",
        icon: "worship"
      });
      events.push({
        time: formatTime(11, 0),
        activity: "Powr\xF3t z ko\u015Bcio\u0142a",
        icon: "home"
      });
    }
    if (diseases.length > 0 && Math.random() > 0.85) {
      const docTime = random(16, 18);
      events.push({
        time: formatTime(docTime),
        activity: "Wizyta lekarska / Apteka",
        icon: "health"
      });
    }
    if (addictions.includes("Alkohol") && (day === "Piątek" || day === "Sobota")) {
      events.push({
        time: formatTime(20, 0),
        activity: `Pub / Monopolowy (${favorites.bar})`,
        icon: "leisure"
      });
    }
    let eveningActivity = "Odpoczynek w domu";
    let eveningIcon = "home";
    let eveningTime = 19;
    if (isParty && (day === "Piątek" || day === "Sobota")) {
      eveningActivity = `Wyjście do klubu (${favorites.club})`;
      eveningIcon = "leisure";
      eveningTime = 22;
    } else if (isActive && !isWeekend && Math.random() > 0.5) {
      eveningActivity = `Siłownia (${favorites.gym})`;
      eveningIcon = "health";
      eveningTime = 18;
    }
    events.push({
      time: formatTime(eveningTime),
      activity: eveningActivity,
      icon: eveningIcon
    });
    let sleepTime = 22;
    if (isParty && (day === "Pi\u0105tek" || day === "Sobota")) sleepTime = 26;
    else if (isLoner) sleepTime = 22;
    else sleepTime = 23;
    const displaySleepTime = sleepTime >= 24 ? formatTime(sleepTime - 24) : formatTime(sleepTime);
    events.push({
      time: displaySleepTime,
      activity: "Sen",
      icon: "sleep"
    });
    routine[day] = events;
  });
  return routine;
};
export {
  generateWeeklyRoutine
};
