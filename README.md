# Description
I made this app for my friend to track his macros. Since in theory he will be the only person using the application, we don't need to create accounts or anything.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Project Description


Project: Macro Tracking App

Tech Stack:
-  Next.js 16.1.0 (React 19, App Router)
-  TypeScript
-  MongoDB with Mongoose ODM
-  Tailwind CSS v4
-  shadcn/ui component library (New York style)
-  React Hook Form with Zod validation

Project Overview:
A terminal-themed macro nutrient tracking web application that allows users to log food intake, track daily macronutrient goals (protein, carbs, fat, calories), and manage a custom food library.

Architecture:

Frontend:
-  Single-page application with a monochrome terminal aesthetic (black background, green terminal-style text)
-  Context API (MacroTrackerContext) manages global state for daily logs, food library, and date selection
-  Main interactive components:
a. MacroSummaryCard - Displays daily macro totals with inline editing capability
b. FoodLogger - Select from food library, input amounts, preview calculated macros before logging
c. CreateFoodForm - Add new custom foods to the library with validation
d. Settings page - Collapsible FOOD_DATABASE_MANAGEMENT; RECENT_LOGS with weekly average and last 7 submitted logs

Backend (API Routes):
-  /api/foods - GET all foods, POST new custom food
-  /api/logs - POST food entry to daily log; GET returns the last 7 **submitted** logs (each submit is a separate entry; same date can appear multiple times)
-  /api/logs/[date] - GET daily log by date (YYYY-MM-DD format)
-  /api/submit - POST to “submit” the current session (moves/merges current log into today’s date and creates one SubmittedLog entry)

Database Schema:
-  Food collection: Stores food items with name, servingSize, servingUnit, and nested macros (protein, carbs, fat, calories)
-  DailyLog collection: Date-keyed documents (one per date, plus optional "current") containing arrays of consumed items and calculated totalMacros
-  SubmittedLog collection: One document per submit (date + totalMacros). Multiple submits on the same calendar date create multiple documents; used for RECENT_LOGS and weekly average

Key Features:
-  Date-based food logging with automatic macro calculation
-  **EXECUTE_SUBMIT_LOG**: Submits the current session to today’s date. Each submit creates a separate entry in RECENT_LOGS (same date can appear multiple times).
-  Food library management (fetch, create custom foods); FOOD_DATABASE_MANAGEMENT section on Settings is collapsible (collapsed by default).
-  Settings page: **RECENT_LOGS** shows weekly average (average daily macros over the last 7 submitted logs) and the last 7 submitted logs.
-  Real-time macro preview when selecting foods
-  Manual macro entry via inline editing in summary card
-  Serving size conversion (user can input any amount, macros scale proportionally)
-  Unique terminal-style UI with uppercase labels, monospace font, and green-on-black color scheme

Type Safety:
Core interfaces defined in src/types/index.ts:
-  MacroData - Nutritional values (protein, carbs, fat, calories)
-  FoodItem - Food database entry
-  ConsumedItem - Food entry with consumed amount
-  DailyLog - Date-specific log with items and totals

Environment:
-  MongoDB Atlas connection via MONGODB_URI environment variable (MongoDB backend account: disheskindastupid@gmail.com)
-  Connection pooling with cached connections for Next.js hot reloading

Styling:
-  Tailwind CSS with custom terminal theme
-  Zero border radius throughout
-  Custom CSS variables for terminal green (#4ade80 hue) and black backgrounds
-  Mobile-responsive with max-width container
