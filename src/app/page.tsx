import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { CreateFoodForm } from "@/components/CreateFoodForm";
import { FoodLogger } from "@/components/FoodLogger";
import { SubmitButton } from "@/components/SubmitButton";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-2 md:p-4 space-y-6 font-mono text-sm md:text-base">
      <header className="mb-6 border-b-2 border-primary pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-primary">
            {">"} TERMINAL_ACCESS_GRANTED
          </h1>
          <Link href="/settings">
            <Settings className="h-6 w-6 text-primary hover:text-primary/80 cursor-pointer" />
          </Link>
        </div>
        <p className="text-muted-foreground mt-2">
          {">"} USER: GREG
          <br />
          {">"} STATUS: ONLINE
          <br />
          {">"} SYSTEM: MACRO_TRACKER_V2.0
        </p>
      </header>

      <div className="space-y-8">
        <MacroSummaryCard />
        <FoodLogger />
        <CreateFoodForm />
        <SubmitButton />
      </div>

      <footer className="mt-12 text-xs text-muted-foreground border-t border-border pt-4 text-center">
        {">"} END_OF_LINE
      </footer>
    </div>
  );
}
