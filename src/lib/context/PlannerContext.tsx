"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LocalPosition } from "@/lib/types";

interface PlannerContextType {
  savedPositions: LocalPosition[];
  savePosition: (position: Omit<LocalPosition, "id" | "createdAt">) => void;
  deletePosition: (id: string) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "lpgarden_positions";

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [savedPositions, setSavedPositions] = useState<LocalPosition[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedPositions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored positions", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedPositions));
    }
  }, [savedPositions, isLoaded]);

  const savePosition = (positionData: Omit<LocalPosition, "id" | "createdAt">) => {
    const newPosition: LocalPosition = {
      ...positionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setSavedPositions((prev) => [newPosition, ...prev]);
  };

  const deletePosition = (id: string) => {
    setSavedPositions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PlannerContext.Provider value={{ savedPositions, savePosition, deletePosition }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error("usePlanner must be used within a PlannerProvider");
  }
  return context;
}
