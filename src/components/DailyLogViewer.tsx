"use client";

import React, { useState } from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function DailyLogViewer() {
    const { dailyLog, deleteLoggedItem, isLoading } = useMacroTracker();
    const [isOpen, setIsOpen] = useState(false);

    if (!dailyLog || !dailyLog.items || dailyLog.items.length === 0) {
        return null;
    }

    return (
        <div className="w-full border border-border p-4 mb-4">
            <div 
                className="flex items-center justify-between cursor-pointer flex-nowrap min-w-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-base font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                    {">"} SYSTEM_MEMORY // RECORDED_LOGS
                </h2>
                <span className="text-foreground font-bold whitespace-nowrap ml-2 flex-shrink-0">
                    {isOpen ? "[ - ]" : "[ + ]"}
                </span>
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
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
            )}
        </div>
    );
}
