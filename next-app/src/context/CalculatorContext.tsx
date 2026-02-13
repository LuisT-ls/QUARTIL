"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface CalculatorContextType {
  currentData: number[];
  isCalculated: boolean;
  setCurrentData: (data: number[]) => void;
  setIsCalculated: (value: boolean) => void;
  processData: (rawInput: string) => number[] | null;
  clearAll: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [currentData, setCurrentData] = useState<number[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const processData = useCallback((rawInput: string): number[] | null => {
    const trimmed = rawInput.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(/[,\s]+/);
    const numeros = parts
      .map((n) => parseFloat(n.replace(",", ".")))
      .filter((n) => !Number.isNaN(n));

    if (numeros.length === 0) return null;
    return [...numeros].sort((a, b) => a - b);
  }, []);

  const clearAll = useCallback(() => {
    setCurrentData([]);
    setIsCalculated(false);
  }, []);

  return (
    <CalculatorContext.Provider
      value={{
        currentData,
        isCalculated,
        setCurrentData,
        setIsCalculated,
        processData,
        clearAll,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error("useCalculator must be used within CalculatorProvider");
  }
  return ctx;
}
