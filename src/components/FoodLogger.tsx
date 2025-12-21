"use client";

import React, { useState, useMemo } from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function FoodLogger() {
    const { foodLibrary, logFood } = useMacroTracker();
    const [selectedFoodId, setSelectedFoodId] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const selectedFood = useMemo(
        () => foodLibrary.find((f) => f.id === selectedFoodId),
        [foodLibrary, selectedFoodId]
    );

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
            alert("Food logged!");
        }
    };

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} SYSTEM_ACTION // LOG_FOOD
            </h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm uppercase tracking-widest text-muted-foreground">
                        {">"} Select_Source:
                    </Label>
                    <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
                        <SelectTrigger className="w-full rounded-none border-border bg-transparent focus:ring-0">
                            <SelectValue placeholder="[ SELECT_FOOD_ITEM ]" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border bg-background text-foreground">
                            {foodLibrary.map((food) => (
                                <SelectItem key={food.id} value={food.id} className="focus:bg-primary focus:text-primary-foreground">
                                    {food.name} ({food.servingSize} {food.servingUnit})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                                <div className="font-bold">{calculatedMacros.calories}</div>
                                <div className="text-xs text-muted-foreground uppercase">Kcal</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.protein}g</div>
                                <div className="text-xs text-muted-foreground uppercase">Prot</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.carbs}g</div>
                                <div className="text-xs text-muted-foreground uppercase">Carb</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.fat}g</div>
                                <div className="text-xs text-muted-foreground uppercase">Fat</div>
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
