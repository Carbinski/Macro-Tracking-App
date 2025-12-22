"use client";

import React from "react";
import { useMacroTracker } from "@/context/MacroTrackerContext";

export function SubmitButton() {
    const { submitDay, isLoading } = useMacroTracker();

    return (
        <div className="w-full flex justify-center mt-8 mb-12">
            <button
                onClick={submitDay}
                disabled={isLoading}
                className="
                    group relative px-8 py-3 
                    bg-transparent text-primary 
                    border-2 border-primary 
                    font-mono font-bold text-lg uppercase tracking-widest
                    hover:bg-primary hover:text-black
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
