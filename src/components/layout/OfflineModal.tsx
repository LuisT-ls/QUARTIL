"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

const getSnapshot = () => navigator.onLine;

const subscribe = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

export function OfflineModal() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => true // fallback for server-side rendering
  );



  if (isOnline) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-modal-title"
      aria-describedby="offline-modal-desc"
    >
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 border-t-white/15 bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/20">
            <WifiOff className="h-8 w-8 text-amber-400" aria-hidden />
          </div>

          <div className="space-y-2">
            <h2
              id="offline-modal-title"
              className="text-xl font-semibold text-slate-100"
            >
              Você está offline
            </h2>
            <p
              id="offline-modal-desc"
              className="text-sm text-slate-400"
            >
              A página já carregada pode continuar fazendo cálculos locais,
              mas recursos que dependem de rede podem não estar disponíveis.
              Seus dados atuais não foram enviados nem perdidos.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Este aviso desaparecerá automaticamente quando a conexão for
            restabelecida.
          </p>
        </div>
      </div>
    </div>
  );
}
