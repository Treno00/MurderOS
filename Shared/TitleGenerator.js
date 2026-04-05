import { pick } from "./utils.js";
import { STREETS } from "./database.js";
const generateTargetTitle = (target) => {
  const getCrime = (c) => c.sentences.length > 0 ? pick(c.sentences) : c.fines.length > 0 ? pick(c.fines) : "Brak notowa\u0144";
  const getMedical = (c) => c.diseases.length > 0 ? pick(c.diseases) : c.addictions.length > 0 ? pick(c.addictions) : "Zdrowy";
  const getWorkAddress = (c) => {
    if (c.workAddress && c.workAddress !== "Brak (Bezrobotny)") return c.workAddress;
    if (c.jobTitle.startsWith("Ucze\u0144")) {
      const streetIndex = parseInt(c.pesel.slice(-2)) % STREETS.length;
      return `ul. ${STREETS[streetIndex]} ${parseInt(c.pesel.slice(4, 6))}`;
    }
    return `ul. Przemys\u0142owa ${parseInt(c.pesel.slice(-2))}`;
  };
  const hasSentences = target.sentences.length > 0;
  const hasFines = target.fines.length > 0;
  const hasDiseases = target.diseases.length > 0;
  const hasAddictions = target.addictions.length > 0;
  const hasWork = target.workAddress.length > 0;
  const stripNumber = (addr) => addr.replace(/\s\d+(\/[0-9]*)?.*$/, "").trim();
  const shortAddress = stripNumber(target.address);
  const shortLivingAddress = stripNumber(target.livingAddress);
  const shortWorkAddress = stripNumber(target.workAddress);
  const formats = [
    (c) => `PESEL: ${c.pesel}`,
    (c) => `${c.firstName} ${c.lastName.charAt(0)}. mieszka na ${shortLivingAddress} (${c.city})`
  ];
  const starter = [
    (c) => `${c.firstName} ${c.lastName.charAt(0)}.`,
    (c) => `${c.firstName.charAt(0)} ${c.lastName}`
  ];
  if (hasSentences) formats.push((c) => `${pick(starter)(c)} jest notowany za ${c.sentences}`);
  if (hasFines) formats.push((c) => `${pick(starter)(c)} p\u0142aci\u0142 grzywny za ${c.fines}`);
  if (hasDiseases) formats.push((c) => `${pick(starter)(c)} jest leczony na ${c.diseases}`);
  if (hasAddictions) formats.push((c) => `${pick(starter)(c)} jest uzale\u017Cniony od ${c.addictions}`);
  const selectedFormat = pick(formats);
  return selectedFormat(target);
};
export {
  generateTargetTitle
};
