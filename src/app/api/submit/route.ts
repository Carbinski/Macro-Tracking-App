import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyLog from '@/models/DailyLog';
import { ConsumedItem, MacroData } from '@/types';

function calculateTotalMacros(items: ConsumedItem[]): MacroData {
    return items.reduce(
        (acc, item) => {
            return {
                protein: acc.protein + item.macros.protein,
                carbs: acc.carbs + item.macros.carbs,
                fat: acc.fat + item.macros.fat,
                calories: acc.calories + item.macros.calories,
            };
        },
        { protein: 0, carbs: 0, fat: 0, calories: 0 }
    );
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        // 1. Find the "current" session log
        const currentLog = await DailyLog.findOne({ date: "current" });

        if (!currentLog) {
            // Nothing to submit
            return NextResponse.json({ message: "No current session to submit" });
        }

        // 2. Determine target date (today's date)
        // Use system time for now. In a real app, might want to accept timezone from client.
        const targetDate = new Date().toISOString().split('T')[0];

        // 3. Find existing log for target date
        let targetLog = await DailyLog.findOne({ date: targetDate });

        if (targetLog) {
            // Merge items
            targetLog.items.push(...currentLog.items);
            targetLog.totalMacros = calculateTotalMacros(targetLog.items);
            await targetLog.save();

            // Delete "current" log
            await DailyLog.deleteOne({ date: "current" });
        } else {
            // Rename "current" log to target date
            // We can't just update the date because _id is immutable usually, but date is just a field.
            // However, to be safe and consistent with "merge" logic:
            // Actually, just updating the date field is fine if no doc exists with that date.
            currentLog.date = targetDate;
            await currentLog.save();
        }

        return NextResponse.json({ message: "Session submitted successfully", date: targetDate });
    } catch (error) {
        console.error('Error submitting session:', error);
        return NextResponse.json({ error: 'Failed to submit session' }, { status: 500 });
    }
}
