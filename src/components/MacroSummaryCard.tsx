"use client";

import React from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function MacroSummaryCard() {
    const { dailyLog } = useMacroTracker();

    const totals = dailyLog?.totalMacros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    };



    const renderMacroItem = (
        label: string,
        macroKey: keyof typeof totals,
        unit: string
    ) => {
        const currentVal = totals[macroKey];

        return (
            <div className="flex flex-col items-start p-2 border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    {">"} {label}
                </span>
                <span className="text-xl font-bold w-full px-1 text-foreground">
                    {currentVal.toFixed(1)}
                    <span className="text-xs font-normal ml-1 opacity-70">
                        {unit}
                    </span>
                </span>
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
