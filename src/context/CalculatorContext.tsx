"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { parseNumberInput } from "@/lib/numberParser";

interface CalculatorContextType {
  inputData: number[];
  currentData: number[];
  isCalculated: boolean;
  isDirty: boolean;
  calculationTimeMs: number | null;
  calculationVersion: number;
  clearVersion: number;
  setInputData: (data: number[]) => void;
  calculateData: (data?: number[]) => void;
  processData: (rawInput: string) => number[] | null;
  clearAll: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [inputData, setInputDataState] = useState<number[]>([]);
  const [currentData, setCurrentData] = useState<number[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [calculationTimeMs, setCalculationTimeMs] = useState<number | null>(null);
  const [calculationVersion, setCalculationVersion] = useState(0);
  const [clearVersion, setClearVersion] = useState(0);

  const setInputData = useCallback(
    (data: number[]) => {
      const nextData = [...data];
      setInputDataState(nextData);

      if (!isCalculated) {
        setIsDirty(false);
        return;
      }

      const isSameData =
        nextData.length === currentData.length &&
        nextData.every((value, index) => value === currentData[index]);

      setIsDirty(!isSameData);
    },
    [currentData, isCalculated]
  );

  const calculateData = useCallback(
    (data: number[] = inputData) => {
      if (data.length === 0) return;

      const start = performance.now();
      const rol = [...data].sort((a, b) => a - b);

      setInputDataState([...data]);
      setCurrentData(rol);
      setIsCalculated(true);
      setIsDirty(false);
      setCalculationTimeMs(performance.now() - start);
      setCalculationVersion((version) => version + 1);
    },
    [inputData]
  );

  const processData = useCallback((rawInput: string): number[] | null => {
    const { values } = parseNumberInput(rawInput);
    if (values.length === 0) return null;
    return [...values].sort((a, b) => a - b);
  }, []);

  const clearAll = useCallback(() => {
    setInputDataState([]);
    setCurrentData([]);
    setIsCalculated(false);
    setIsDirty(false);
    setCalculationTimeMs(null);
    setClearVersion((version) => version + 1);
  }, []);

  return (
    <CalculatorContext.Provider
      value={{
        inputData,
        currentData,
        isCalculated,
        isDirty,
        calculationTimeMs,
        calculationVersion,
        clearVersion,
        setInputData,
        calculateData,
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
