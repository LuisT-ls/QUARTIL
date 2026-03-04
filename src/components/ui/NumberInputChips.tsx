"use client";

import { useState, KeyboardEvent, ClipboardEvent, useRef } from "react";
import { X } from "lucide-react";

interface NumberInputChipsProps {
    values: number[];
    onChange: (values: number[]) => void;
    onCalculate?: () => void;
    placeholder?: string;
    className?: string;
}

export function NumberInputChips({
    values,
    onChange,
    onCalculate,
    placeholder = "Ex: 10, 20. Digite espaço, vírgula ou Enter.",
    className = "",
}: NumberInputChipsProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const processInputString = (raw: string) => {
        const parts = raw.split(/[,\s\n\t;]+/);
        const newNums = parts
            .map((n) => parseFloat(n.replace(",", ".")))
            .filter((n) => !Number.isNaN(n));
        return newNums;
    };

    const handleCreateChips = (raw: string) => {
        const newNums = processInputString(raw);
        if (newNums.length > 0) {
            onChange([...values, ...newNums]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === " " || e.key === ";") {
            e.preventDefault();
            const val = inputValue.trim();

            if (val) {
                handleCreateChips(val);
            } else if (e.key === "Enter" && onCalculate) {
                onCalculate();
            }
        } else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
            onChange(values.slice(0, -1));
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        handleCreateChips(pastedData);
    };

    const handleBlur = () => {
        const val = inputValue.trim();
        if (val) {
            handleCreateChips(val);
        }
    };

    const removeChip = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div
            className={`flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-lg border border-white/20 bg-slate-800/50 p-2 backdrop-blur-sm transition-colors duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 ${className}`}
            onClick={() => inputRef.current?.focus()}
        >
            {values.map((val, i) => (
                <span
                    key={i}
                    className="flex animate-in zoom-in duration-200 items-center gap-1 rounded bg-blue-500/20 py-1 pl-3 pr-1 text-sm font-medium text-blue-100 ring-1 ring-inset ring-blue-500/40"
                >
                    {val}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeChip(i);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-sm text-blue-300 transition-colors hover:bg-blue-500/30 hover:text-white"
                        aria-label={`Remover valor ${val}`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={handleBlur}
                placeholder={values.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[150px] bg-transparent pb-1 pt-1 text-slate-100 placeholder-slate-500 focus:outline-none"
            />
        </div>
    );
}
