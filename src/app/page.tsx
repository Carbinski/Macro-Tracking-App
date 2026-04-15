import { MacroSummaryCard } from "@/components/MacroSummaryCard";
import { DailyLogViewer } from "@/components/DailyLogViewer";
import { ManualLogger } from "@/components/ManualLogger";
import { CreateFoodForm } from "@/components/CreateFoodForm";
import { FoodLogger } from "@/components/FoodLogger";
import { FoodLibraryManager } from "@/components/FoodLibraryManager";
import { SubmitButton } from "@/components/SubmitButton";
import { Settings } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const username = session.user.name?.toUpperCase() || "UNKNOWN";

  return (
    <div className="p-2 md:p-4 space-y-6 font-mono text-sm md:text-base">
      <header className="mb-6 border-b-2 border-foreground pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-foreground">
            {">"} TERMINAL_ACCESS_GRANTED
          </h1>
          <Link href="/settings">
            <Settings className="h-6 w-6 text-foreground hover:text-foreground/80 cursor-pointer" />
          </Link>
        </div>
        <p className="text-muted-foreground mt-2">
          {">"} USER: {username}
          <br />
          {">"} STATUS: ONLINE
          <br />
          {">"} SYSTEM: MACRO_TRACKER_V3.1
        </p>
      </header>

      <div className="space-y-8">
        <MacroSummaryCard />
        <DailyLogViewer />
        <ManualLogger />
        <FoodLogger />
        <CreateFoodForm />
        <FoodLibraryManager />
        <SubmitButton />
      </div>

      <footer className="mt-12 text-xs text-muted-foreground border-t border-border pt-4 text-center">
        {">"} END_OF_LINE
      </footer>
    </div>
  );
}
