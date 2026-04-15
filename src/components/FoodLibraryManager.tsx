"use client";

import React, { useState } from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function FoodLibraryManager() {
    const { foodLibrary, deleteFood } = useMacroTracker();
    const [isOpen, setIsOpen] = useState(false);

    if (!foodLibrary || foodLibrary.length === 0) {
        return null;
    }

    return (
        <div className="w-full border border-border p-4 mb-4">
            <div 
                className="flex items-center justify-between cursor-pointer flex-nowrap min-w-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-base font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                    {">"} SYSTEM_DATABASE // FOOD_LIBRARY
                </h2>
                <span className="text-foreground font-bold whitespace-nowrap ml-2 flex-shrink-0">
                    {isOpen ? "[ - ]" : "[ + ]"}
                </span>
            </div>
            
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-border space-y-2 max-h-64 overflow-y-auto pr-2">
                    {foodLibrary.map((food) => (
                        <div key={food.id} className="flex justify-between items-center p-2 text-sm border border-dashed border-border hover:bg-primary/10 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold uppercase tracking-widest text-foreground">
                                    {food.name}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase opacity-80">
                                    {food.servingSize}{food.servingUnit} | {food.macros.calories}kcal
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFood(food.id);
                                }}
                                className="text-destructive opacity-50 hover:opacity-100 transition-opacity font-bold px-2 py-1"
                                title="Remove food"
                            >
                                [X]
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
