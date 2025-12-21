import mongoose from 'mongoose';
import Food from '@/models/Food';
import dbConnect from '@/lib/db';

const INITIAL_FOOD_DB = [
    {
        name: 'Chicken Breast (Grilled)',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 31, carbs: 0, fat: 3.6, calories: 165 },
    },
    {
        name: 'Brown Rice (Cooked)',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 2.6, carbs: 23, fat: 0.9, calories: 111 },
    },
    {
        name: 'Avocado',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 2, carbs: 8.5, fat: 14.7, calories: 160 },
    },
];

async function seed() {
    try {
        await dbConnect();

        // Check if DB is empty
        const count = await Food.countDocuments();
        if (count > 0) {
            console.log('Database already seeded');
            return;
        }

        await Food.insertMany(INITIAL_FOOD_DB);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Allow running this script directly if needed, but since we are in Next.js environment,
// it's easier to expose it as an API route or just run it once via a temporary component or manual invocation.
// For now, I'll export it so it can be called.
export default seed;
