"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DailyLog, FoodItem, MacroData, ConsumedItem } from "@/types";

interface MacroTrackerContextType {
    dailyLog: DailyLog | null;
    foodLibrary: FoodItem[];
    selectedDate: string;
    isLoading: boolean;
    error: string | null;
    changeDate: (date: string) => void;
    logFood: (foodId: string, amount: number, unit: string) => Promise<void>;
    addManualEntry: (macros: MacroData) => Promise<void>;
    addCustomFood: (food: FoodItem) => Promise<void>;
    deleteFood: (foodId: string) => Promise<void>;
    submitDay: () => Promise<void>;
}

const MacroTrackerContext = createContext<MacroTrackerContextType | undefined>(
    undefined
);

export function MacroTrackerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedDate, setSelectedDate] = useState<string>("current");
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load food library
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await fetch('/api/foods');
                if (!res.ok) throw new Error('Failed to fetch foods');
                const data = await res.json();
                setFoodLibrary(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load food library');
            }
        };
        fetchFoods();
    }, []);

    // Load daily log when date changes
    useEffect(() => {
        const fetchLog = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/logs/${selectedDate}`);
                if (!res.ok) throw new Error('Failed to fetch daily log');
                const data = await res.json();
                setDailyLog(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load daily log');
                setDailyLog(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLog();
    }, [selectedDate]);

    const changeDate = (date: string) => {
        setSelectedDate(date);
    };

    const logFood = async (foodId: string, amount: number, unit: string) => {
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
            servingUnit: unit,
            macros: newMacros,
        };

        try {
            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, item: consumedItem }),
            });

            if (!res.ok) throw new Error('Failed to log food');

            const updatedLog = await res.json();
            setDailyLog(updatedLog);
        } catch (err) {
            console.error(err);
            setError('Failed to log food');
        }
    };

    const addManualEntry = async (macros: MacroData) => {
        const manualItem: ConsumedItem = {
            id: crypto.randomUUID(),
            name: "Manual Entry",
            servingSize: 1,
            servingUnit: "serving",
            consumedAmount: 1,
            macros: macros,
        };

        try {
            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, item: manualItem }),
            });

            if (!res.ok) throw new Error('Failed to add manual entry');

            const updatedLog = await res.json();
            setDailyLog(updatedLog);
        } catch (err) {
            console.error(err);
            setError('Failed to add manual entry');
        }
    };

    const addCustomFood = async (food: FoodItem) => {
        try {
            // Remove ID if it's a temp ID, let DB handle it? 
            // Actually the API expects a FoodItem structure. 
            // If we send an ID, Mongoose might complain if it's not an ObjectId or if we try to set _id.
            // But our FoodItem interface has 'id'.
            // Let's strip 'id' before sending if it's just a placeholder.
            const { id, ...foodData } = food;

            const res = await fetch('/api/foods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData),
            });

            if (!res.ok) throw new Error('Failed to add custom food');

            const newFood = await res.json();
            setFoodLibrary((prev) => [...prev, newFood]);
        } catch (err) {
            console.error(err);
            setError('Failed to add custom food');
        }
    };

    const deleteFood = async (foodId: string) => {
        try {
            const res = await fetch(`/api/foods/${foodId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete food');

            setFoodLibrary((prev) => prev.filter((f) => f.id !== foodId));
        } catch (err) {
            console.error(err);
            setError('Failed to delete food');
        }
    };

    const submitDay = async () => {
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Failed to submit day');

            setIsLoading(true);
            const logRes = await fetch(`/api/logs/current`);
            if (logRes.ok) {
                const data = await logRes.json();
                setDailyLog(data);
            } else {
                setDailyLog(null);
            }
            setIsLoading(false);

        } catch (err) {
            console.error(err);
            setError('Failed to submit day');
        }
    };

    return (
        <MacroTrackerContext.Provider
            value={{
                dailyLog,
                foodLibrary,
                selectedDate,
                isLoading,
                error,
                changeDate,
                logFood,
                addManualEntry,
                addCustomFood,
                deleteFood,
                submitDay,
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
