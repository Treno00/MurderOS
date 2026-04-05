import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useGame } from "../../../Scripts/App/GameContext.js";
import { useConnectionBoard } from "../../../Scripts/Intel/Connections/useConnectionBoard.js";
import { User, Briefcase, GraduationCap, Home, FileText, Link, Trash2, Edit3, Save } from "lucide-react";
const ConnectionBoard = () => {
  const { toggleConnectionBoard } = useGame();
  const {
    nodes,
    edges,
    addNode,
    removeNode,
    updateNodePosition,
    updateNodeData,
    addConnection,
    removeConnection,
    clearBoard,
    selectedNodeId,
    setSelectedNodeId
  } = useConnectionBoard();
  const [contextMenu, setContextMenu] = useState(null);
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingSource, setConnectingSource] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const boardRef = useRef(null);
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  const handleAddNode = (type) => {
    if (contextMenu) {
      addNode(type, contextMenu.x, contextMenu.y);
      setContextMenu(null);
    }
  };
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    if (connectingSource) {
      addConnection(connectingSource, id);
      setConnectingSource(null);
      return;
    }
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setIsDragging(id);
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      });
      setSelectedNodeId(id);
    }
  };
  const handleMouseMove = (e) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    if (isDragging) {
      updateNodePosition(isDragging, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    }
  };
  const handleMouseUp = () => {
    setIsDragging(null);
  };
  const startConnection = (e, id) => {
    e.stopPropagation();
    setConnectingSource(id);
    setContextMenu(null);
  };
  const cancelConnection = () => {
    setConnectingSource(null);
  };
  const getNodeIcon = (type) => {
    switch (type) {
      case "PERSON":
        return /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-blue-400" });
      case "WORK":
        return /* @__PURE__ */ jsx(Briefcase, { className: "w-4 h-4 text-emerald-400" });
      case "EDUCATION":
        return /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-purple-400" });
      case "LOCATION":
        return /* @__PURE__ */ jsx(Home, { className: "w-4 h-4 text-orange-400" });
      case "RECORD":
        return /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-red-400" });
      case "NOTE":
        return /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-yellow-400" });
      default:
        return /* @__PURE__ */ jsx(User, { className: "w-4 h-4" });
    }
  };
  const getNodeColor = (type) => {
    switch (type) {
      case "PERSON":
        return "border-blue-500/50 bg-blue-950/80";
      case "WORK":
        return "border-emerald-500/50 bg-emerald-950/80";
      case "EDUCATION":
        return "border-purple-500/50 bg-purple-950/80";
      case "LOCATION":
        return "border-orange-500/50 bg-orange-950/80";
      case "RECORD":
        return "border-red-500/50 bg-red-950/80";
      case "NOTE":
        return "border-yellow-500/50 bg-yellow-950/80";
      default:
        return "border-slate-500/50 bg-slate-900";
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: boardRef,
      className: "w-full h-full bg-slate-950 relative overflow-hidden cursor-crosshair font-sans text-slate-200",
      onContextMenu: handleContextMenu,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onClick: () => {
        setContextMenu(null);
        if (connectingSource) cancelConnection();
        if (editingNodeId) {
        } else {
          setEditingNodeId(null);
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-10 pointer-events-none",
            style: { backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "40px 40px" }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              clearBoard();
            },
            className: "absolute top-4 right-4 z-50 p-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white rounded shadow-lg transition-colors border border-red-500/30",
            title: "Wyczy\u015B\u0107 Tablic\u0119",
            children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 z-40 bg-black/50 p-2 rounded text-[10px] text-slate-400 pointer-events-none select-none border border-slate-800", children: [
          /* @__PURE__ */ jsx("p", { children: "PPM - Dodaj W\u0119ze\u0142" }),
          /* @__PURE__ */ jsx("p", { children: "LPM (Przeci\u0105gnij) - Przesu\u0144" }),
          /* @__PURE__ */ jsx("p", { children: 'Kliknij "+" - Po\u0142\u0105cz w\u0119z\u0142y' }),
          /* @__PURE__ */ jsx("p", { children: 'Kliknij "Edytuj" - Zmie\u0144 dane' })
        ] }),
        /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full pointer-events-none z-0", children: [
          edges.map((edge) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;
            const x1 = source.x + 100;
            const y1 = source.y + 60;
            const x2 = target.x + 100;
            const y2 = target.y + 60;
            return /* @__PURE__ */ jsxs("g", { children: [
              /* @__PURE__ */ jsx(
                "line",
                {
                  x1,
                  y1,
                  x2,
                  y2,
                  stroke: "#64748b",
                  strokeWidth: "2",
                  className: "opacity-60"
                }
              ),
              /* @__PURE__ */ jsx("circle", { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, r: "4", fill: "#ef4444", className: "cursor-pointer pointer-events-auto opacity-0 hover:opacity-100", onClick: () => removeConnection(edge.id) })
            ] }, edge.id);
          }),
          connectingSource && /* @__PURE__ */ jsx(
            "line",
            {
              x1: nodes.find((n) => n.id === connectingSource).x + 100,
              y1: nodes.find((n) => n.id === connectingSource).y + 60,
              x2: mousePos.x,
              y2: mousePos.y,
              stroke: "#3b82f6",
              strokeWidth: "2",
              strokeDasharray: "5,5",
              className: "opacity-80 animate-pulse"
            }
          )
        ] }),
        nodes.map((node) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: { left: node.x, top: node.y, width: "200px" },
            className: `absolute rounded-lg shadow-xl p-3 select-none transition-shadow group z-10 border ${getNodeColor(node.type)} ${selectedNodeId === node.id ? "ring-2 ring-white" : ""}`,
            onMouseDown: (e) => handleMouseDown(e, node.id),
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2 border-b border-white/10 pb-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  getNodeIcon(node.type),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider opacity-70", children: node.type })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => startConnection(e, node.id),
                      className: "p-1 hover:bg-blue-500/20 rounded text-blue-400",
                      title: "Po\u0142\u0105cz",
                      children: /* @__PURE__ */ jsx(Link, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setEditingNodeId(node.id);
                      },
                      className: "p-1 hover:bg-yellow-500/20 rounded text-yellow-400",
                      title: "Edytuj",
                      children: /* @__PURE__ */ jsx(Edit3, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        removeNode(node.id);
                      },
                      className: "p-1 hover:bg-red-500/20 rounded text-red-400",
                      title: "Usu\u0144",
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ] })
              ] }),
              editingNodeId === node.id ? /* @__PURE__ */ jsxs("div", { className: "space-y-2 cursor-auto", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: [
                node.type === "LOCATION" && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-300 focus:border-blue-500 outline-none mb-1",
                    value: node.data.dropdownValue || "Zameldowanie",
                    onChange: (e) => updateNodeData(node.id, { dropdownValue: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "Zameldowanie", children: "Zameldowanie" }),
                      /* @__PURE__ */ jsx("option", { value: "Zamieszkanie", children: "Zamieszkanie" }),
                      /* @__PURE__ */ jsx("option", { value: "Przebywa", children: "Przebywa" }),
                      /* @__PURE__ */ jsx("option", { value: "Praca", children: "Praca" }),
                      /* @__PURE__ */ jsx("option", { value: "Inne", children: "Inne" })
                    ]
                  }
                ),
                node.type === "RECORD" && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-300 focus:border-blue-500 outline-none mb-1",
                    value: node.data.dropdownValue || "Wyroki",
                    onChange: (e) => updateNodeData(node.id, { dropdownValue: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "Wyroki", children: "Wyroki" }),
                      /* @__PURE__ */ jsx("option", { value: "Grzywny", children: "Grzywny" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-black/50 border border-white/20 rounded px-1 text-xs text-white focus:border-blue-500 outline-none",
                    value: node.data.title,
                    onChange: (e) => updateNodeData(node.id, { title: e.target.value }),
                    placeholder: node.type === "PERSON" ? "Imi\u0119" : node.type === "EDUCATION" ? "Nazwa szko\u0142y" : node.type === "LOCATION" ? "Miasto" : node.type === "WORK" ? "Firma" : node.type === "NOTE" ? "Tytu\u0142" : "Tytu\u0142",
                    autoFocus: true
                  }
                ),
                node.type !== "NOTE" && node.type !== "RECORD" && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-300 focus:border-blue-500 outline-none",
                    value: node.data.subtitle || "",
                    onChange: (e) => updateNodeData(node.id, { subtitle: e.target.value }),
                    placeholder: node.type === "PERSON" ? "Nazwisko" : node.type === "EDUCATION" ? "Adres szko\u0142y" : node.type === "LOCATION" ? "Adres" : node.type === "WORK" ? "Zatrudnienie" : ""
                  }
                ),
                node.type === "PERSON" && /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-1/2 bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-300 focus:border-blue-500 outline-none",
                      value: node.data.field1 || "",
                      onChange: (e) => updateNodeData(node.id, { field1: e.target.value }),
                      placeholder: "Data Ur"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-1/2 bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-300 focus:border-blue-500 outline-none",
                      value: node.data.field2 || "",
                      onChange: (e) => updateNodeData(node.id, { field2: e.target.value }),
                      placeholder: "Nr Tel."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full bg-black/50 border border-white/20 rounded px-1 text-[10px] text-slate-400 resize-none h-12 focus:border-blue-500 outline-none",
                    value: node.data.field3 || "",
                    onChange: (e) => updateNodeData(node.id, { field3: e.target.value }),
                    placeholder: node.type === "NOTE" || node.type === "RECORD" ? "Zawarto\u015B\u0107..." : "Notatki..."
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setEditingNodeId(null);
                    },
                    className: "w-full bg-green-600 hover:bg-green-500 text-white text-[10px] py-1 rounded font-bold flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx(Save, { className: "w-3 h-3" }),
                      " ZAPISZ"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                node.data.dropdownValue && /* @__PURE__ */ jsx("div", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 border-b border-white/10 pb-0.5", children: node.data.dropdownValue }),
                /* @__PURE__ */ jsx("div", { className: "font-bold text-sm truncate text-white", children: node.data.title }),
                node.type !== "NOTE" && node.type !== "RECORD" && node.data.subtitle && /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-300 truncate", children: node.data.subtitle }),
                node.type === "PERSON" && (node.data.field1 || node.data.field2) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { children: node.data.field1 }),
                  /* @__PURE__ */ jsx("span", { children: node.data.field2 })
                ] }),
                node.data.field3 && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-500 italic mt-1 line-clamp-3 border-t border-white/5 pt-1", children: node.data.field3 })
              ] })
            ]
          },
          node.id
        )),
        contextMenu && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute z-50 bg-slate-900 border border-slate-700 rounded shadow-2xl p-1 w-40 animate-in fade-in zoom-in duration-100",
            style: { left: contextMenu.x, top: contextMenu.y },
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold text-slate-500 px-2 py-1 border-b border-slate-800 mb-1", children: "Dodaj W\u0119ze\u0142" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("PERSON"), icon: User, label: "Osoba", color: "text-blue-400" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("EDUCATION"), icon: GraduationCap, label: "Edukacja", color: "text-purple-400" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("LOCATION"), icon: Home, label: "Lokalizacja", color: "text-orange-400" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("WORK"), icon: Briefcase, label: "Praca", color: "text-emerald-400" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("RECORD"), icon: FileText, label: "Kartoteka", color: "text-red-400" }),
              /* @__PURE__ */ jsx(MenuButton, { onClick: () => handleAddNode("NOTE"), icon: FileText, label: "Notatka", color: "text-yellow-400" })
            ]
          }
        )
      ]
    }
  );
};
const MenuButton = ({ onClick, icon: Icon, label, color }) => /* @__PURE__ */ jsxs(
  "button",
  {
    onClick,
    className: "w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800 rounded text-xs text-slate-300 transition-colors text-left",
    children: [
      /* @__PURE__ */ jsx(Icon, { className: `w-3 h-3 ${color}` }),
      label
    ]
  }
);
var stdin_default = ConnectionBoard;
export {
  stdin_default as default
};
