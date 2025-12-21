import { DailyLog, FoodItem, ConsumedItem } from '@/types';

// Initial mock data
const INITIAL_FOOD_DB: FoodItem[] = [
    {
        id: '1',
        name: 'Chicken Breast (Grilled)',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 31, carbs: 0, fat: 3.6, calories: 165 },
    },
    {
        id: '2',
        name: 'Brown Rice (Cooked)',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 2.6, carbs: 23, fat: 0.9, calories: 111 },
    },
    {
        id: '3',
        name: 'Avocado',
        servingSize: 100,
        servingUnit: 'g',
        macros: { protein: 2, carbs: 8.5, fat: 14.7, calories: 160 },
    },
];

// Simulation of a database using localStorage
const STORAGE_KEYS = {
    FOOD_DB: 'macro_tracker_food_db',
    DAILY_LOGS: 'macro_tracker_daily_logs',
};

export const mockDb = {
    getFoodDatabase: (): FoodItem[] => {
        if (typeof window === 'undefined') return INITIAL_FOOD_DB;

        const stored = localStorage.getItem(STORAGE_KEYS.FOOD_DB);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.FOOD_DB, JSON.stringify(INITIAL_FOOD_DB));
            return INITIAL_FOOD_DB;
        }
        return JSON.parse(stored);
    },

    addCustomFood: (food: FoodItem): void => {
        if (typeof window === 'undefined') return;

        const currentDb = mockDb.getFoodDatabase();
        const updatedDb = [...currentDb, food];
        localStorage.setItem(STORAGE_KEYS.FOOD_DB, JSON.stringify(updatedDb));
    },

    getDailyLog: (date: string): DailyLog | null => {
        if (typeof window === 'undefined') return null;

        const storedLogs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
        const logs: DailyLog[] = storedLogs ? JSON.parse(storedLogs) : [];
        return logs.find((log) => log.date === date) || null;
    },

    logDailyEntry: (date: string, item: ConsumedItem): void => {
        if (typeof window === 'undefined') return;

        const storedLogs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
        let logs: DailyLog[] = storedLogs ? JSON.parse(storedLogs) : [];

        const existingLogIndex = logs.findIndex((log) => log.date === date);

        if (existingLogIndex >= 0) {
            const log = logs[existingLogIndex];
            log.items.push(item);
            // Recalculate totals
            log.totalMacros = calculateTotalMacros(log.items);
            logs[existingLogIndex] = log;
        } else {
            const newLog: DailyLog = {
                id: crypto.randomUUID(),
                date,
                items: [item],
                totalMacros: calculateTotalMacros([item]),
            };
            logs.push(newLog);
        }

        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    },
};

function calculateTotalMacros(items: ConsumedItem[]) {
    return items.reduce(
        (acc, item) => {
            const ratio = item.consumedAmount / item.servingSize;
            return {
                protein: acc.protein + item.macros.protein * ratio,
                carbs: acc.carbs + item.macros.carbs * ratio,
                fat: acc.fat + item.macros.fat * ratio,
                calories: acc.calories + item.macros.calories * ratio,
            };
        },
        { protein: 0, carbs: 0, fat: 0, calories: 0 }
    );
}
