"use client";

import { useMacroTracker } from "@/context/MacroTrackerContext";
import { Trash2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DailyLog, MacroData } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";

function averageMacros(logs: DailyLog[]): MacroData | null {
    if (logs.length === 0) return null;
    return {
        protein: logs.reduce((s, l) => s + l.totalMacros.protein, 0) / logs.length,
        carbs: logs.reduce((s, l) => s + l.totalMacros.carbs, 0) / logs.length,
        fat: logs.reduce((s, l) => s + l.totalMacros.fat, 0) / logs.length,
        calories: logs.reduce((s, l) => s + l.totalMacros.calories, 0) / logs.length,
    };
}

export default function SettingsPage() {
    const { foodLibrary, deleteFood } = useMacroTracker();
    const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
    const [foodDbExpanded, setFoodDbExpanded] = useState(false);

    // useEffect(() => {
    //     const fetchLogs = async () => {
    //         try {
    //             const res = await fetch('/api/logs');
    //             if (res.ok) {
    //                 const data = await res.json();
    //                 setRecentLogs(Array.isArray(data) ? data : []);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch logs', error);
    //         }
    //     };
    //     fetchLogs();
    // }, []);

    const lastSevenLogs = [] as DailyLog[];
    const weeklyAvg = averageMacros(lastSevenLogs);

    return (
        <div className="p-2 md:p-4 space-y-6 font-mono text-sm md:text-base min-h-screen bg-background text-foreground">
            <header className="mb-6 border-b-2 border-foreground pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 hover:bg-foreground/10">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-foreground">
                        {">"} SYSTEM_SETTINGS
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <div className="space-y-6">
                <div className="border-2 border-foreground p-4">
                    <button
                        type="button"
                        onClick={() => setFoodDbExpanded((prev) => !prev)}
                        className="flex w-full items-center gap-2 text-left border-b border-foreground pb-2 mb-4 hover:opacity-80 transition-opacity"
                    >
                        {foodDbExpanded ? (
                            <ChevronDown className="h-5 w-5 shrink-0 text-foreground" />
                        ) : (
                            <ChevronRight className="h-5 w-5 shrink-0 text-foreground" />
                        )}
                        <h2 className="text-lg font-bold text-foreground">
                            FOOD_DATABASE_MANAGEMENT
                        </h2>
                        {!foodDbExpanded && (
                            <span className="text-xs text-muted-foreground ml-auto">
                                ({foodLibrary.length} items)
                            </span>
                        )}
                    </button>

                    {foodDbExpanded && (
                        <div className="space-y-2">
                            {foodLibrary.length === 0 ? (
                                <p className="text-muted-foreground">{">"} DATABASE_EMPTY</p>
                            ) : (
                                foodLibrary.map((food) => (
                                    <div
                                        key={food.id}
                                        className="flex items-center justify-between p-2 border border-foreground/30 hover:border-foreground/60 transition-colors"
                                    >
                                        <div>
                                            <p className="font-bold text-foreground">{food.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {food.servingSize} {food.servingUnit} |
                                                P:{food.macros.protein} C:{food.macros.carbs} F:{food.macros.fat} |
                                                {food.macros.calories} kcal
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteFood(food.id)}
                                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="border-2 border-foreground p-4">
                <h2 className="text-lg font-bold text-foreground mb-4 border-b border-foreground pb-2">
                    {">"} RECENT_LOGS
                </h2>

                {weeklyAvg && (
                    <div className="mb-4 p-3 border border-foreground/50 bg-foreground/5">
                        <p className="font-bold text-foreground mb-1">{">"} WEEKLY_AVG (last 7 days logged)</p>
                        <p className="text-sm text-muted-foreground">
                            P:{Math.round(weeklyAvg.protein)} C:{Math.round(weeklyAvg.carbs)} F:{Math.round(weeklyAvg.fat)} |
                            CAL:{Math.round(weeklyAvg.calories)}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    {lastSevenLogs.length === 0 ? (
                        <p className="text-muted-foreground">{">"} NO_LOGS_FOUND</p>
                    ) : (
                        lastSevenLogs.map((log) => (
                            <div
                                key={log.id}
                                className="p-2 border border-foreground/30 hover:border-foreground/60 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-foreground">DATE: {log.date}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    P:{Math.round(log.totalMacros.protein)} C:{Math.round(log.totalMacros.carbs)} F:{Math.round(log.totalMacros.fat)} |
                                    CAL:{Math.round(log.totalMacros.calories)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <footer className="mt-12 text-xs text-muted-foreground border-t border-border pt-4 text-center">
                {">"} END_OF_LINE
            </footer>
        </div>
    );
}
