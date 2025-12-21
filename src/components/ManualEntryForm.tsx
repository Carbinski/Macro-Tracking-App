"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function ManualEntryForm() {
    const { addManualEntry } = useMacroTracker();
    const [formData, setFormData] = useState({
        protein: "",
        carbs: "",
        fat: "",
        calories: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numbers
        if (value && !/^\d*\.?\d*$/.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addManualEntry({
            protein: Number(formData.protein) || 0,
            carbs: Number(formData.carbs) || 0,
            fat: Number(formData.fat) || 0,
            calories: Number(formData.calories) || 0,
        });
        // Reset form
        setFormData({ protein: "", carbs: "", fat: "", calories: "" });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                                id="protein"
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                placeholder="0"
                                inputMode="decimal"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                                id="carbs"
                                name="carbs"
                                value={formData.carbs}
                                onChange={handleChange}
                                placeholder="0"
                                inputMode="decimal"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fat">Fat (g)</Label>
                            <Input
                                id="fat"
                                name="fat"
                                value={formData.fat}
                                onChange={handleChange}
                                placeholder="0"
                                inputMode="decimal"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input
                                id="calories"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                placeholder="0"
                                inputMode="decimal"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Track
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
