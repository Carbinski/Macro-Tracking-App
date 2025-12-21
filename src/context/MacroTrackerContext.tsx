"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DailyLog, FoodItem, MacroData, ConsumedItem } from "@/types";
import { mockDb } from "@/lib/mockData";

interface MacroTrackerContextType {
    dailyLog: DailyLog | null;
    foodLibrary: FoodItem[];
    selectedDate: string;
    changeDate: (date: string) => void;
    logFood: (foodId: string, amount: number, unit: string) => void;
    addManualEntry: (macros: MacroData) => void;
    addCustomFood: (food: FoodItem) => void;
}

const MacroTrackerContext = createContext<MacroTrackerContextType | undefined>(
    undefined
);

export function MacroTrackerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>([]);

    // Load initial data
    useEffect(() => {
        setFoodLibrary(mockDb.getFoodDatabase());
    }, []);

    // Load daily log when date changes
    useEffect(() => {
        const log = mockDb.getDailyLog(selectedDate);
        setDailyLog(log);
    }, [selectedDate]);

    const changeDate = (date: string) => {
        setSelectedDate(date);
    };

    const logFood = (foodId: string, amount: number, unit: string) => {
        const food = foodLibrary.find((f) => f.id === foodId);
        if (!food) {
            console.error("Food not found");
            return;
        }

        const ratio = amount / food.servingSize;
        const newMacros: MacroData = {
            protein: Number((food.macros.protein * ratio).toFixed(1)),
            carbs: Number((food.macros.carbs * ratio).toFixed(1)),
            fat: Number((food.macros.fat * ratio).toFixed(1)),
            calories: Number((food.macros.calories * ratio).toFixed(0)),
        };

        const consumedItem: ConsumedItem = {
            ...food,
            consumedAmount: amount,
            servingUnit: unit, // Overwrite unit if needed, though usually same as food.servingUnit
            macros: newMacros,
        };

        mockDb.logDailyEntry(selectedDate, consumedItem);
        // Refresh log
        setDailyLog(mockDb.getDailyLog(selectedDate));
    };

    const addManualEntry = (macros: MacroData) => {
        const manualItem: ConsumedItem = {
            id: crypto.randomUUID(),
            name: "Manual Entry",
            servingSize: 1,
            servingUnit: "serving",
            consumedAmount: 1,
            macros: macros,
        };

        mockDb.logDailyEntry(selectedDate, manualItem);
        setDailyLog(mockDb.getDailyLog(selectedDate));
    };

    const addCustomFood = (food: FoodItem) => {
        mockDb.addCustomFood(food);
        setFoodLibrary(mockDb.getFoodDatabase());
    };

    return (
        <MacroTrackerContext.Provider
            value={{
                dailyLog,
                foodLibrary,
                selectedDate,
                changeDate,
                logFood,
                addManualEntry,
                addCustomFood,
            }}
        >
            {children}
        </MacroTrackerContext.Provider>
    );
}

export function useMacroTracker() {
    const context = useContext(MacroTrackerContext);
    if (context === undefined) {
        throw new Error(
            "useMacroTracker must be used within a MacroTrackerProvider"
        );
    }
    return context;
}
