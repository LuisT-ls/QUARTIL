"use client";

import { useState, useRef, useEffect } from "react";

interface RandomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (numbers: number[]) => void;
}

export function RandomPopup({
  isOpen,
  onClose,
  onGenerate,
}: RandomPopupProps) {
  const [quantidade, setQuantidade] = useState(20);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [apenasInteiros, setApenasInteiros] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  const handleGenerate = () => {
    if (quantidade < 5 || quantidade > 100) {
      alert("A quantidade de números deve estar entre 5 e 100.");
      return;
    }
    if (min >= max) {
      alert("O valor mínimo deve ser menor que o valor máximo.");
      return;
    }

    const numeros: number[] = [];
    for (let i = 0; i < quantidade; i++) {
      if (apenasInteiros) {
        numeros.push(
          Math.floor(Math.random() * (max - min + 1)) + min
        );
      } else {
        const num = Math.random() * (max - min) + min;
        numeros.push(Math.round(num * 100) / 100);
      }
    }

    onGenerate(numeros);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1060] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="random-popup-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded p-2 text-2xl leading-none text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700"
          aria-label="Fechar"
        >
          &times;
        </button>
        <h3 id="random-popup-title" className="mb-4 text-xl font-semibold">
          Gerar Números Aleatórios
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="quantidadeNumeros"
              className="mb-1 block text-sm font-medium"
            >
              Quantidade de números:
            </label>
            <input
              id="quantidadeNumeros"
              type="number"
              min={5}
              max={100}
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value, 10) || 20)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label
              htmlFor="valorMinimo"
              className="mb-1 block text-sm font-medium"
            >
              Valor mínimo:
            </label>
            <input
              id="valorMinimo"
              type="number"
              value={min}
              onChange={(e) => setMin(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label
              htmlFor="valorMaximo"
              className="mb-1 block text-sm font-medium"
            >
              Valor máximo:
            </label>
            <input
              id="valorMaximo"
              type="number"
              value={max}
              onChange={(e) => setMax(parseFloat(e.target.value) || 100)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="numerosInteiros"
              type="checkbox"
              checked={apenasInteiros}
              onChange={(e) => setApenasInteiros(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="numerosInteiros" className="text-sm">
              Apenas números inteiros
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white transition-colors hover:bg-[#3a0ca3]"
          aria-label="Gerar números aleatórios"
        >
          Gerar
        </button>
      </div>
    </div>
  );
}
