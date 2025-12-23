"use client";

import React, { useState } from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function MacroSummaryCard() {
    const { dailyLog, addManualEntry } = useMacroTracker();
    const [editingMacro, setEditingMacro] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");

    const totals = dailyLog?.totalMacros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    };

    const handleClick = (macro: string) => {
        setEditingMacro(macro);
        setInputValue("");
    };

    const handleSave = (e: React.KeyboardEvent<HTMLInputElement>, macro: string) => {
        if (e.key === "Enter") {
            const value = parseFloat(inputValue);
            if (!isNaN(value) && value !== 0) {
                const newMacros = {
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    calories: 0,
                    [macro]: value,
                };
                addManualEntry(newMacros);
            }
            setEditingMacro(null);
            setInputValue("");
        } else if (e.key === "Escape") {
            setEditingMacro(null);
            setInputValue("");
        }
    };

    const renderMacroItem = (
        label: string,
        macroKey: keyof typeof totals,
        unit: string
    ) => {
        const isEditing = editingMacro === macroKey;
        const currentVal = totals[macroKey];

        return (
            <div className="flex flex-col items-start p-2 border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    {">"} {label}
                </span>
                {isEditing ? (
                    <div className="flex items-center w-full">
                        <span className="mr-2 text-primary">{">"}</span>
                        <Input
                            autoFocus
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => handleSave(e, macroKey)}
                            onBlur={() => setEditingMacro(null)}
                            className="h-8 bg-transparent border-none text-xl font-bold p-0 focus-visible:ring-0 rounded-none shadow-none"
                            placeholder="_"
                        />
                    </div>
                ) : (
                    <span
                        className="text-xl font-bold cursor-pointer hover:bg-primary hover:text-primary-foreground w-full px-1 transition-colors"
                        onClick={() => handleClick(macroKey)}
                    >
                        {currentVal.toFixed(1)}
                        <span className="text-xs font-normal ml-1 opacity-70">
                            {unit}
                        </span>
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} SYSTEM_STATUS // DAILY_SUMMARY
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {renderMacroItem("CALORIES", "calories", "kcal")}
                {renderMacroItem("PROTEIN", "protein", "g")}
                {renderMacroItem("CARBS", "carbs", "g")}
                {renderMacroItem("FAT", "fat", "g")}
            </div>
        </div>
    );
}
