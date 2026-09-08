import { useSyncExternalStore } from "react";

export interface AnalysisRecord {
  id: string;
  name: string;
  values: number[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveAnalysisInput {
  name: string;
  values: number[];
}

const STORAGE_KEY = "quartil:analysis-history:v1";
const MAX_ANALYSES = 20;
const SERVER_SNAPSHOT: AnalysisRecord[] = [];
let cachedSnapshot: AnalysisRecord[] | null = null;
const subscribers = new Set<() => void>();

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeAnalysisName(name: string): string {
  return name.trim().slice(0, 80);
}

function isAnalysisRecord(value: unknown): value is AnalysisRecord {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<AnalysisRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string" &&
    Array.isArray(record.values) &&
    record.values.every((number) => typeof number === "number" && Number.isFinite(number))
  );
}

function readStorage(): AnalysisRecord[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAnalysisRecord).slice(0, MAX_ANALYSES);
  } catch {
    return [];
  }
}

function getSnapshot(): AnalysisRecord[] {
  if (cachedSnapshot === null) {
    cachedSnapshot = readStorage();
  }

  return cachedSnapshot;
}

function getServerSnapshot(): AnalysisRecord[] {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  subscribers.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedSnapshot = null;
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    subscribers.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function persist(records: AnalysisRecord[]) {
  cachedSnapshot = records;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // A memória da sessão continua atualizada mesmo quando o armazenamento falha.
  }

  notify();
}

export const analysisHistoryStore = {
  save({ name, values }: SaveAnalysisInput): AnalysisRecord | null {
    const normalizedName = normalizeAnalysisName(name);
    const validValues = values.filter((value) => Number.isFinite(value));
    if (!normalizedName || validValues.length === 0) return null;

    const now = new Date().toISOString();
    const record: AnalysisRecord = {
      id: createId(),
      name: normalizedName,
      values: [...validValues],
      createdAt: now,
      updatedAt: now,
    };

    persist([record, ...getSnapshot()].slice(0, MAX_ANALYSES));
    return record;
  },

  rename(id: string, name: string) {
    const normalizedName = normalizeAnalysisName(name);
    if (!normalizedName) return;

    const records = getSnapshot().map((record) =>
      record.id === id
        ? { ...record, name: normalizedName, updatedAt: new Date().toISOString() }
        : record
    );
    persist(records);
  },

  remove(id: string) {
    persist(getSnapshot().filter((record) => record.id !== id));
  },

  duplicate(id: string): AnalysisRecord | null {
    const source = getSnapshot().find((record) => record.id === id);
    if (!source) return null;

    return this.save({
      name: `${source.name} (cópia)`,
      values: source.values,
    });
  },
};

export function useAnalysisHistory(): AnalysisRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
