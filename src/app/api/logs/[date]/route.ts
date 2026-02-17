import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyLog from '@/models/DailyLog';
import { auth } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const { date } = await params;
        const log = await DailyLog.findOne({ userId, date });
        return NextResponse.json(log || null);
    } catch (error) {
        console.error('Error fetching daily log:', error);
        return NextResponse.json({ error: 'Failed to fetch daily log' }, { status: 500 });
    }
}
