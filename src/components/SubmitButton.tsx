"use client";

import React from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function SubmitButton() {
    const { submitDay, isLoading } = useMacroTracker();

    return (
        <div className="w-full mt-8 mb-12">
            <button
                onClick={submitDay}
                disabled={isLoading}
                className="
                    group relative w-full py-4 
                    bg-transparent text-foreground 
                    border-2 border-foreground 
                    font-mono font-bold text-lg uppercase tracking-widest
                    hover:bg-foreground hover:text-background
                    active:translate-y-1
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                "
            >
                <span className="mr-2">{">"}</span>
                EXECUTE_SUBMIT_LOG
                <span className="ml-2 animate-pulse">_</span>
            </button>
        </div>
    );
}
