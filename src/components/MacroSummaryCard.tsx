"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground mb-1">{label}</span>
                {isEditing ? (
                    <Input
                        autoFocus
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => handleSave(e, macroKey)}
                        onBlur={() => setEditingMacro(null)}
                        className="w-24 h-10 text-center text-2xl font-bold"
                        placeholder="Add/Sub"
                    />
                ) : (
                    <span
                        className="text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleClick(macroKey)}
                    >
                        {currentVal}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                            {unit}
                        </span>
                    </span>
                )}
            </div>
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {renderMacroItem("Calories", "calories", "kcal")}
                    {renderMacroItem("Protein", "protein", "g")}
                    {renderMacroItem("Carbs", "carbs", "g")}
                    {renderMacroItem("Fat", "fat", "g")}
                </div>
            </CardContent>
        </Card>
    );
}
