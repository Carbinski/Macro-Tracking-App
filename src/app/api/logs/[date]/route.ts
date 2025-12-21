import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyLog from '@/models/DailyLog';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    try {
        await dbConnect();
        const { date } = await params;
        const log = await DailyLog.findOne({ date });
        return NextResponse.json(log || null);
    } catch (error) {
        console.error('Error fetching daily log:', error);
        return NextResponse.json({ error: 'Failed to fetch daily log' }, { status: 500 });
    }
}
