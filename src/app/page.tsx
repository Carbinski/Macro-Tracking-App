import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { ManualEntryForm } from "@/components/ManualEntryForm";
import { CreateFoodForm } from "@/components/CreateFoodForm";
import { FoodLogger } from "@/components/FoodLogger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Today's Progress</h1>
        <p className="text-muted-foreground">Track your nutrition goals</p>
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="log-food">Log Food</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-1">
              <MacroSummaryCard />
            </div>
            <div className="md:col-span-1">
              <ManualEntryForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="log-food" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-1">
              <FoodLogger />
            </div>
            <div className="md:col-span-1">
              <CreateFoodForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
