import { useState, useCallback, useEffect } from "react";
import { GameState } from "../../App/GameState.js";
const useConnectionBoard = () => {
  const [nodes, setNodes] = useState(GameState.boardNodes);
  const [edges, setEdges] = useState(GameState.boardEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  useEffect(() => {
    GameState.boardNodes = nodes;
  }, [nodes]);
  useEffect(() => {
    GameState.boardEdges = edges;
  }, [edges]);
  const addNode = useCallback((type, x, y) => {
    const newNode = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      data: {
        title: "",
        subtitle: "",
        field1: "",
        field2: "",
        field3: "",
        dropdownValue: type === "LOCATION" ? "Zameldowanie" : type === "RECORD" ? "Wyroki" : void 0
      }
    };
    setNodes((prev) => [...prev, newNode]);
  }, []);
  const removeNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  }, []);
  const updateNodePosition = useCallback((id, x, y) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, x, y } : n));
  }, []);
  const updateNodeData = useCallback((id, data) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
  }, []);
  const addConnection = useCallback((sourceId, targetId) => {
    if (sourceId === targetId) return;
    setEdges((prev) => {
      if (prev.find((e) => e.source === sourceId && e.target === targetId || e.source === targetId && e.target === sourceId)) {
        return prev;
      }
      return [...prev, {
        id: crypto.randomUUID(),
        source: sourceId,
        target: targetId
      }];
    });
  }, []);
  const removeConnection = useCallback((id) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  }, []);
  const clearBoard = useCallback(() => {
    setNodes([]);
    setEdges([]);
    GameState.boardNodes = [];
    GameState.boardEdges = [];
  }, []);
  return {
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
  };
};
export {
  useConnectionBoard
};
