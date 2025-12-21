import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { CreateFoodForm } from "@/components/CreateFoodForm";
import { FoodLogger } from "@/components/FoodLogger";

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Today's Progress</h1>
        <p className="text-muted-foreground">Track your nutrition goals</p>
      </header>

      <div className="space-y-6">
        <MacroSummaryCard />
        <FoodLogger />
        <CreateFoodForm />
      </div>
    </div>
  );
}
