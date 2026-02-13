"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineModal() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOffline(false);
      window.location.reload();
    }
  };

  if (!hasMounted || !isOffline) return null;

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
              Verifique sua conexão com a internet. A calculadora continua
              disponível para uso local — seus dados não foram perdidos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Tentar novamente
          </button>

          <p className="text-xs text-slate-500">
            Este aviso desaparecerá automaticamente quando a conexão for
            restabelecida.
          </p>
        </div>
      </div>
    </div>
  );
}
