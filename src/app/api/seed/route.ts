import { NextResponse } from 'next/server';
import seed from '@/lib/seed';

export async function GET() {
    try {
        await seed();
        return NextResponse.json({ message: 'Seeding process completed' });
    } catch (error) {
        return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
    }
}
