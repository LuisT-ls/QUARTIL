"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "quartil:privacy-notice:v1";
const PRIVACY_CHANGE_EVENT = "quartil:privacy-notice-change";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PRIVACY_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PRIVACY_CHANGE_EVENT, onStoreChange);
  };
};

const getSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "dismissed";
  } catch {
    return false;
  }
};

const getServerSnapshot = () => false;

export function PrivacyNotice() {
  const isDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // O fechamento visual continua funcionando sem persistência.
    }
    window.dispatchEvent(new Event(PRIVACY_CHANGE_EVENT));
  };

  if (isDismissed) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 z-[900] max-w-md rounded-xl border border-white/15 bg-slate-900/95 p-4 text-sm text-slate-300 shadow-2xl backdrop-blur-md"
      aria-label="Aviso de privacidade"
    >
      <p>
        Os números inseridos são processados no seu navegador. Usamos métricas
        do Google Analytics para entender o uso da aplicação, sem enviar seus
        valores nos eventos de produto.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Entendi
      </button>
    </aside>
  );
}
