"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function MacroSummaryCard() {
    const { dailyLog } = useMacroTracker();

    const totals = dailyLog?.totalMacros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    };

    // Default goals
    const goals = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
    };

    const calculateProgress = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Calories</span>
                        <span className="text-muted-foreground">
                            {totals.calories} / {goals.calories} kcal
                        </span>
                    </div>
                    <Progress value={calculateProgress(totals.calories, goals.calories)} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Protein</span>
                        <span className="text-muted-foreground">
                            {totals.protein} / {goals.protein}g
                        </span>
                    </div>
                    <Progress value={calculateProgress(totals.protein, goals.protein)} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Carbs</span>
                        <span className="text-muted-foreground">
                            {totals.carbs} / {goals.carbs}g
                        </span>
                    </div>
                    <Progress value={calculateProgress(totals.carbs, goals.carbs)} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Fat</span>
                        <span className="text-muted-foreground">
                            {totals.fat} / {goals.fat}g
                        </span>
                    </div>
                    <Progress value={calculateProgress(totals.fat, goals.fat)} />
                </div>
            </CardContent>
        </Card>
    );
}
