import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { CreateFoodForm } from "@/components/CreateFoodForm";
import { FoodLogger } from "@/components/FoodLogger";

export default function Home() {
  return (
    <div className="p-2 md:p-4 space-y-6 font-mono text-sm md:text-base">
      <header className="mb-6 border-b-2 border-primary pb-4">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-primary">
          {">"} TERMINAL_ACCESS_GRANTED
        </h1>
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
      </div>

      <footer className="mt-12 text-xs text-muted-foreground border-t border-border pt-4 text-center">
        {">"} END_OF_LINE
      </footer>
    </div>
  );
}
