import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();

        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
        }

        const results: string[] = [];

        // Drop old unique index on DailyLog.date (was unique: true, now part of compound index)
        try {
            const dailyLogCollection = db.collection('dailylogs');
            const indexes = await dailyLogCollection.indexes();
            const dateIndex = indexes.find(
                (idx) => idx.key && 'date' in idx.key && Object.keys(idx.key).length === 1 && idx.unique
            );
            if (dateIndex && dateIndex.name) {
                await dailyLogCollection.dropIndex(dateIndex.name);
                results.push(`Dropped old unique index on DailyLog.date: ${dateIndex.name}`);
            } else {
                results.push('No old unique date index found on DailyLog — already migrated or never existed');
            }
        } catch (err) {
            results.push(`DailyLog index migration note: ${err}`);
        }

        return NextResponse.json({ message: 'Migration completed', results });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
