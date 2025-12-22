"use client";

import React, { useState, useMemo } from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function FoodLogger() {
    const { foodLibrary, logFood } = useMacroTracker();
    const [selectedFoodId, setSelectedFoodId] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const selectedFood = useMemo(
        () => foodLibrary.find((f) => f.id === selectedFoodId),
        [foodLibrary, selectedFoodId]
    );

    const filteredFoods = useMemo(() => {
        if (!searchQuery) return [];
        return foodLibrary.filter((food) =>
            food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [foodLibrary, searchQuery]);

    const calculatedMacros = useMemo(() => {
        if (!selectedFood || !amount) return null;
        const val = parseFloat(amount);
        if (isNaN(val)) return null;

        const ratio = val / selectedFood.servingSize;
        return {
            calories: Math.round(selectedFood.macros.calories * ratio),
            protein: (selectedFood.macros.protein * ratio).toFixed(1),
            carbs: (selectedFood.macros.carbs * ratio).toFixed(1),
            fat: (selectedFood.macros.fat * ratio).toFixed(1),
        };
    }, [selectedFood, amount]);

    const handleLog = () => {
        if (selectedFoodId && amount) {
            logFood(selectedFoodId, parseFloat(amount), selectedFood?.servingUnit || "g");
            setAmount("");
            setSelectedFoodId("");
            setSearchQuery("");
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsSearching(true);
        if (selectedFoodId) {
            setSelectedFoodId("");
        }
    };

    const handleSelectFood = (food: typeof foodLibrary[0]) => {
        setSelectedFoodId(food.id);
        setSearchQuery(food.name);
        setIsSearching(false);
    };

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} SYSTEM_ACTION // LOG_FOOD
            </h2>
            <div className="space-y-4">
                <div className="space-y-2 relative">
                    <Label className="text-sm uppercase tracking-widest text-muted-foreground">
                        {">"} Select_Source:
                    </Label>
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearching(true)}
                        placeholder="[ TYPE_TO_SEARCH ]"
                        className="w-full rounded-none border-border bg-white focus:ring-0"
                    />

                    {isSearching && searchQuery && filteredFoods.length > 0 && (
                        <div
                            className="absolute z-50 w-full mt-1 border border-border bg-white text-black max-h-60 overflow-y-auto shadow-lg"
                            style={{ backgroundColor: 'white' }}
                        >
                            {filteredFoods.map((food) => (
                                <div
                                    key={food.id}
                                    className="p-2 cursor-pointer hover:bg-gray-100 hover:text-black text-sm uppercase tracking-wider"
                                    onClick={() => handleSelectFood(food)}
                                >
                                    {food.name} ({food.servingSize} {food.servingUnit})
                                </div>
                            ))}
                        </div>
                    )}
                    {isSearching && searchQuery && filteredFoods.length === 0 && (
                        <div
                            className="absolute z-50 w-full mt-1 border border-border bg-white text-black p-2 text-sm uppercase tracking-wider shadow-lg"
                            style={{ backgroundColor: 'white' }}
                        >
                            [ NO_MATCHES_FOUND ]
                        </div>
                    )}
                </div>

                {selectedFood && (
                    <div className="space-y-2">
                        <Label className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Input_Amount ({selectedFood.servingUnit}):
                        </Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`_`}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                    </div>
                )}

                {calculatedMacros && (
                    <div className="p-2 border border-dashed border-muted-foreground/50 space-y-2 text-sm font-mono">
                        <p className="uppercase tracking-widest border-b border-dashed border-muted-foreground/50 pb-1 mb-2">
                            {">>"} PREVIEW_CALCULATION
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="font-bold">{calculatedMacros.calories}</div>
                                <div className="text-xs text-muted-foreground uppercase">CALORIES</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.protein}g</div>
                                <div className="text-xs text-muted-foreground uppercase">PROTEIN</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.carbs}g</div>
                                <div className="text-xs text-muted-foreground uppercase">CARBS</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.fat}g</div>
                                <div className="text-xs text-muted-foreground uppercase">FAT</div>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    className="w-full rounded-none border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest font-bold"
                    disabled={!selectedFood || !amount}
                    onClick={handleLog}
                >
                    [ EXECUTE_LOG ]
                </Button>
            </div>
        </div>
    );
}
