"use client";

import React from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function DailyLogViewer() {
    const { dailyLog, deleteLoggedItem, isLoading } = useMacroTracker();

    if (!dailyLog || !dailyLog.items || dailyLog.items.length === 0) {
        return null;
    }

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} SYSTEM_MEMORY // RECORDED_LOGS
            </h2>
            <div className="space-y-4">
                {dailyLog.items.map((item) => (
                    <div key={item.id} className="p-3 border border-border relative flex flex-col group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-bold uppercase tracking-wider text-base text-foreground">
                                    {">"} {item.name}
                                </span>
                                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                                    Consumed: {item.consumedAmount} {item.servingUnit}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteLoggedItem(item.id)}
                                disabled={isLoading}
                                className="text-destructive opacity-50 hover:opacity-100 transition-opacity font-bold ml-4 p-1"
                                title="Remove entry"
                            >
                                [X]
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs font-mono border-t border-dashed border-border pt-2 mt-1">
                            <div className="text-center">
                                <span className="text-muted-foreground uppercase">CAL</span>
                                <br />
                                {item.macros.calories}
                            </div>
                            <div className="text-center">
                                <span className="text-muted-foreground uppercase">PRO</span>
                                <br />
                                {item.macros.protein}g
                            </div>
                            <div className="text-center">
                                <span className="text-muted-foreground uppercase">CARB</span>
                                <br />
                                {item.macros.carbs}g
                            </div>
                            <div className="text-center">
                                <span className="text-muted-foreground uppercase">FAT</span>
                                <br />
                                {item.macros.fat}g
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
