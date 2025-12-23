import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyLog from '@/models/DailyLog';
import { ConsumedItem, MacroData } from '@/types';

function calculateTotalMacros(items: ConsumedItem[]): MacroData {
    return items.reduce(
        (acc, item) => {
            // If the item has a ratio property (from legacy code), use it, otherwise calculate it
            // However, the ConsumedItem type in Mongoose schema stores the calculated macros directly usually?
            // Actually, in the mockData logic:
            // const ratio = item.consumedAmount / item.servingSize;
            // return {
            //     protein: acc.protein + item.macros.protein * ratio,
            //     ...
            // };
            // BUT, the `item.macros` passed in from the frontend (logFood) are ALREADY calculated for the consumed amount!
            // Let's verify `MacroTrackerContext.tsx`:
            // const newMacros: MacroData = {
            //     protein: Number((food.macros.protein * ratio).toFixed(1)),
            //     ...
            // };
            // const consumedItem: ConsumedItem = { ...macros: newMacros };
            // So the macros in ConsumedItem ARE the totals for that entry.

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
        const { date, item } = await request.json();

        if (!date || !item) {
            return NextResponse.json({ error: 'Missing date or item' }, { status: 400 });
        }

        let log = await DailyLog.findOne({ date });

        if (log) {
            log.items.push(item);
            log.totalMacros = calculateTotalMacros(log.items);
            await log.save();
        } else {
            const totalMacros = calculateTotalMacros([item]);
            log = await DailyLog.create({
                date,
                items: [item],
                totalMacros,
            });
        }

        return NextResponse.json(log);
    } catch (error) {
        console.error('Error logging food:', error);
        return NextResponse.json({ error: 'Failed to log food' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const logs = await DailyLog.find().sort({ date: -1 }).limit(5);
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
