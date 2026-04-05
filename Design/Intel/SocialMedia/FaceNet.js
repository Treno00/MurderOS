import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Users, Download, Search, MapPin, Heart, UserCircle, Key, Loader2, UserPlus } from "lucide-react";
import { useFaceNet } from "../../../Scripts/Intel/SocialMedia/useFaceNet.js";
const FaceNet = () => {
  const {
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
    showDownloadBtn
  } = useFaceNet();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-slate-900 border border-blue-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-blue-900/30 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-blue-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-5 h-5" }),
        "FaceNet"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-blue-400/70 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value),
              className: "w-full bg-black border border-blue-900/50 p-2 text-sm focus:border-blue-500 outline-none rounded text-blue-100 placeholder:text-blue-900/50 transition-all",
              placeholder: "Szukaj..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-blue-400/70 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: lastName,
              onChange: (e) => setLastName(e.target.value),
              className: "w-full bg-black border border-blue-900/50 p-2 text-sm focus:border-blue-500 outline-none rounded text-blue-100 placeholder:text-blue-900/50 transition-all",
              placeholder: "Szukaj..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-blue-400/70 uppercase font-bold mb-1 block", children: "Miasto" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: city,
              onChange: (e) => setCity(e.target.value),
              className: "w-full bg-black border border-blue-900/50 p-2 text-sm focus:border-blue-500 outline-none rounded text-blue-100 placeholder:text-blue-900/50 transition-all",
              placeholder: "Szukaj..."
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-slate-900 border border-blue-900/30 rounded relative overflow-hidden flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-5 pointer-events-none",
          style: { backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10", children: results.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: results.map((citizen) => /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-blue-900/30 rounded-lg overflow-hidden shadow-md hover:border-blue-500/50 transition-colors group", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex gap-4 items-center border-b border-blue-900/30 bg-blue-900/10", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400", children: /* @__PURE__ */ jsx(UserCircle, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-blue-100 text-lg tracking-wide", children: [
              citizen.firstName,
              " ",
              citizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-blue-400/70 flex items-center gap-1 font-mono", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
              " ",
              citizen.city
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3 text-sm text-slate-300 font-mono", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Heart, { className: "w-4 h-4 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { children: citizen.relationshipStatus })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-blue-500" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Wiek: ",
              citizen.age
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 text-[10px] mt-2", children: citizen.hobbies && citizen.hobbies.map((h) => /* @__PURE__ */ jsx("span", { className: "bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30 text-blue-300", children: ["#", h] }, h)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-blue-900/30", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-blue-400", children: [
              /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-xs uppercase", children: [
                "Znajomi: ",
                citizen.friendsCount
              ] })
            ] }) }),
            !analyzedFriendsIds.has(citizen.id) ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleAnalyzeFriends(citizen),
                disabled: analyzingId !== null,
                className: `w-full text-[10px] py-2 rounded font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${analyzingId === citizen.id ? "bg-blue-600 text-white cursor-wait" : analyzingId !== null ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-500/30"}`,
                children: analyzingId === citizen.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }),
                  " ANALIZOWANIE..."
                ] }) : "ANALIZUJ ZNAJOMYCH"
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "bg-blue-900/20 border border-blue-500/30 p-2 rounded animate-in fade-in zoom-in duration-300", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-blue-300 mb-1", children: [
                /* @__PURE__ */ jsx(Key, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold uppercase text-[9px]", children: "Nazwisko Panie\u0144skie Matki" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-white font-bold tracking-wider pl-5", children: citizen.mothersMaidenName })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", children: !analyzedMediaIds.has(citizen.id) ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleAnalyzeMedia(citizen),
                disabled: analyzingId !== null,
                className: `w-full text-[10px] py-2 rounded font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${analyzingId === citizen.id ? "bg-blue-600 text-white cursor-wait" : analyzingId !== null ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-500/30"}`,
                children: analyzingId === citizen.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }),
                  " ANALIZOWANIE..."
                ] }) : "ANALIZUJ MEDIA"
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "bg-blue-900/20 border border-blue-500/30 p-2 rounded animate-in fade-in zoom-in duration-300 space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-blue-300 mb-1", children: [
                  /* @__PURE__ */ jsx(Key, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold uppercase text-[9px]", children: "InstaNet Handle" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-white font-bold tracking-wider pl-5", children: citizen.socialMedia.instaNetHandle })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-blue-300 mb-1", children: [
                  /* @__PURE__ */ jsx(Key, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold uppercase text-[9px]", children: "WorkLink Handle" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-white font-bold tracking-wider pl-5", children: citizen.socialMedia.workLinkHandle })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500 mt-2 pt-2 border-t border-blue-900/30 flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold uppercase text-[9px]", children: "FaceNet ID" }),
            /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: citizen.socialMedia.faceNetId })
          ] })
        ] }),
        showDownloadBtn && /* @__PURE__ */ jsx("div", { className: "p-3 bg-black/40 border-t border-blue-900/30 flex justify-end", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDownload(citizen),
            className: "text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors uppercase tracking-wider shadow-[0_0_10px_rgba(37,99,235,0.2)] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
              " ZAPISZ DANE"
            ]
          }
        ) })
      ] }, citizen.id)) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-blue-900/30", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-16 h-16 opacity-20 mb-4 animate-pulse" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-mono uppercase tracking-widest font-bold", children: "Wyszukaj profil w bazie FaceNet" })
      ] }) })
    ] })
  ] });
};
var stdin_default = FaceNet;
export {
  stdin_default as default
};
