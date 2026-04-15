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

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const { date, item } = await request.json();

        if (!date || !item) {
            return NextResponse.json({ error: 'Missing date or item' }, { status: 400 });
        }

        let log = await DailyLog.findOne({ userId, date });

        if (log) {
            log.items.push(item);
            log.totalMacros = calculateTotalMacros(log.items);
            await log.save();
        } else {
            const totalMacros = calculateTotalMacros([item]);
            log = await DailyLog.create({
                userId,
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
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const logs = await SubmittedLog.find({ userId }).sort({ createdAt: -1 }).limit(7).lean();
        return NextResponse.json(logs.map((doc) => ({
            id: doc._id.toString(),
            date: doc.date,
            totalMacros: doc.totalMacros,
        })));
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const { date, itemId } = await request.json();

        if (!date || !itemId) {
            return NextResponse.json({ error: 'Missing date or itemId' }, { status: 400 });
        }

        let log = await DailyLog.findOne({ userId, date });

        if (!log) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        const initialLength = log.items.length;
        log.items = log.items.filter((item: ConsumedItem) => item.id !== itemId);
        
        if (log.items.length === initialLength) {
            return NextResponse.json({ error: 'Item not found in log' }, { status: 404 });
        }

        log.totalMacros = calculateTotalMacros(log.items);
        await log.save();

        return NextResponse.json(log);
    } catch (error) {
        console.error('Error deleting log item:', error);
        return NextResponse.json({ error: 'Failed to delete log item' }, { status: 500 });
    }
}
