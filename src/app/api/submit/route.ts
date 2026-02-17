import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyLog from '@/models/DailyLog';
import SubmittedLog from '@/models/SubmittedLog';
import { auth } from '@/lib/auth';
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

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();

        const currentLog = await DailyLog.findOne({ userId, date: "current" });

        if (!currentLog) {
            return NextResponse.json({ message: "No current session to submit" });
        }

        const targetDate = new Date().toISOString().split('T')[0];

        let targetLog = await DailyLog.findOne({ userId, date: targetDate });

        if (targetLog) {
            targetLog.items.push(...currentLog.items);
            targetLog.totalMacros = calculateTotalMacros(targetLog.items);
            await targetLog.save();

            await DailyLog.deleteOne({ userId, date: "current" });
        } else {
            currentLog.date = targetDate;
            await currentLog.save();
        }

        await SubmittedLog.create({
            userId,
            date: targetDate,
            totalMacros: currentLog.totalMacros,
        });

        return NextResponse.json({ message: "Session submitted successfully", date: targetDate });
    } catch (error) {
        console.error('Error submitting session:', error);
        return NextResponse.json({ error: 'Failed to submit session' }, { status: 500 });
    }
}
