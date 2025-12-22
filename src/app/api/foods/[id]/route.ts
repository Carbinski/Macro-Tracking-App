import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Food from '@/models/Food';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return NextResponse.json(
                { error: 'Food not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Food deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting food:', error);
        return NextResponse.json(
            { error: 'Failed to delete food' },
            { status: 500 }
        );
    }
}
