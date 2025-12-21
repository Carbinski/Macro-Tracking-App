import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Food from '@/models/Food';

export async function GET() {
    try {
        await dbConnect();
        const foods = await Food.find({}).sort({ name: 1 });
        return NextResponse.json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const food = await Food.create(body);
        return NextResponse.json(food, { status: 201 });
    } catch (error) {
        console.error('Error creating food:', error);
        return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
    }
}
