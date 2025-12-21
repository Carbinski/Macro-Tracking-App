"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Log Food</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Food</Label>
                    <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Search food..." />
                        </SelectTrigger>
                        <SelectContent>
                            {foodLibrary.map((food) => (
                                <SelectItem key={food.id} value={food.id}>
                                    {food.name} ({food.servingSize} {food.servingUnit})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedFood && (
                    <div className="space-y-2">
                        <Label>Amount Consumed ({selectedFood.servingUnit})</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`e.g., ${selectedFood.servingSize}`}
                        />
                    </div>
                )}

                {calculatedMacros && (
                    <div className="p-4 bg-muted rounded-md space-y-2 text-sm">
                        <p className="font-semibold">Preview:</p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                                <div className="font-bold">{calculatedMacros.calories}</div>
                                <div className="text-xs text-muted-foreground">Kcal</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.protein}g</div>
                                <div className="text-xs text-muted-foreground">Prot</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.carbs}g</div>
                                <div className="text-xs text-muted-foreground">Carbs</div>
                            </div>
                            <div>
                                <div className="font-bold">{calculatedMacros.fat}g</div>
                                <div className="text-xs text-muted-foreground">Fat</div>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    className="w-full"
                    disabled={!selectedFood || !amount}
                    onClick={handleLog}
                >
                    Add Entry
                </Button>
            </CardContent>
        </Card>
    );
}
