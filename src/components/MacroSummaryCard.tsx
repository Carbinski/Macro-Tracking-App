"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

    // Default goals
    const goals = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
    };

    const calculateProgress = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
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

    const renderMacroRow = (
        label: string,
        macroKey: keyof typeof totals,
        goal: number,
        unit: string
    ) => {
        const isEditing = editingMacro === macroKey;
        const currentVal = totals[macroKey];

        return (
            <div className="space-y-2">
                <div className="flex justify-between text-sm items-center h-8">
                    <span>{label}</span>
                    {isEditing ? (
                        <Input
                            autoFocus
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => handleSave(e, macroKey)}
                            onBlur={() => setEditingMacro(null)}
                            className="w-24 h-8 text-right"
                            placeholder="Add/Sub"
                        />
                    ) : (
                        <span
                            className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => handleClick(macroKey)}
                        >
                            {currentVal} / {goal}{unit}
                        </span>
                    )}
                </div>
                <Progress value={calculateProgress(currentVal, goal)} />
            </div>
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {renderMacroRow("Calories", "calories", goals.calories, " kcal")}
                {renderMacroRow("Protein", "protein", goals.protein, "g")}
                {renderMacroRow("Carbs", "carbs", goals.carbs, "g")}
                {renderMacroRow("Fat", "fat", goals.fat, "g")}
            </CardContent>
        </Card>
    );
}
