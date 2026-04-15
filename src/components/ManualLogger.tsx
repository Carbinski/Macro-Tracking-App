"use client";

import React, { useState } from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";
import { Input } from "@/components/ui/input";

export function ManualLogger() {
    const { addManualEntry, isLoading } = useMacroTracker();
    
    const [macros, setMacros] = useState({
        calories: "",
        protein: "",
        carbs: "",
        fat: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const c = parseFloat(macros.calories) || 0;
        const p = parseFloat(macros.protein) || 0;
        const cb = parseFloat(macros.carbs) || 0;
        const f = parseFloat(macros.fat) || 0;

        if (c === 0 && p === 0 && cb === 0 && f === 0) return;

        addManualEntry({
            calories: c,
            protein: p,
            carbs: cb,
            fat: f
        });

        setMacros({
            calories: "",
            protein: "",
            carbs: "",
            fat: ""
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMacros(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} TERMINAL_INPUT // MANUAL_LOG
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest">{">"} CALORIES</label>
                        <Input 
                            type="number" 
                            name="calories"
                            value={macros.calories}
                            onChange={handleChange}
                            placeholder="0"
                            className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest">{">"} PROTEIN (g)</label>
                        <Input 
                            type="number" 
                            name="protein"
                            value={macros.protein}
                            onChange={handleChange}
                            placeholder="0"
                            className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest">{">"} CARBS (g)</label>
                        <Input 
                            type="number" 
                            name="carbs"
                            value={macros.carbs}
                            onChange={handleChange}
                            placeholder="0"
                            className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest">{">"} FAT (g)</label>
                        <Input 
                            type="number" 
                            name="fat"
                            value={macros.fat}
                            onChange={handleChange}
                            placeholder="0"
                            className="bg-transparent border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-none"
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full uppercase font-bold tracking-wider border border-foreground p-2 hover:bg-foreground hover:text-background transition-colors touch-manipulation mt-2"
                >
                    [ EXECUTE_LOG ]
                </button>
            </form>
        </div>
    );
}
