"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMacroTracker } from "@/context/MacroTrackerContext";
import { FoodItem } from "@/types";

const foodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    servingSize: z.coerce.number().positive("Must be positive"),
    servingUnit: z.string().min(1, "Unit is required"),
    calories: z.coerce.number().min(0),
    protein: z.coerce.number().min(0),
    carbs: z.coerce.number().min(0),
    fat: z.coerce.number().min(0),
});

type FoodFormValues = z.infer<typeof foodSchema>;

export function CreateFoodForm() {
    const { addCustomFood } = useMacroTracker();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FoodFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(foodSchema) as any,
        defaultValues: {
            name: "",
            servingSize: 100,
            servingUnit: "g",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
        },
    });

    const onSubmit = (data: FoodFormValues) => {
        const newFood: FoodItem = {
            id: crypto.randomUUID(),
            name: data.name,
            servingSize: data.servingSize,
            servingUnit: data.servingUnit,
            macros: {
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
            },
        };
        addCustomFood(newFood);
        reset();
        alert("Food added to library!");
    };

    return (
        <div className="w-full border border-border p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">
                {">"} DATABASE // NEW_ENTRY
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm uppercase tracking-widest text-muted-foreground">
                        {">"} Food_Name:
                    </label>
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="_"
                        className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive mt-1">{">>"} ERROR: {errors.name.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="servingSize" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Serving_Size:
                        </label>
                        <Input
                            id="servingSize"
                            type="number"
                            step="any"
                            {...register("servingSize")}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                        {errors.servingSize && (
                            <p className="text-xs text-destructive mt-1">{">>"} ERROR: {errors.servingSize.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="servingUnit" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Unit:
                        </label>
                        <Input
                            id="servingUnit"
                            {...register("servingUnit")}
                            placeholder="g"
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                        {errors.servingUnit && (
                            <p className="text-xs text-destructive mt-1">{">>"} ERROR: {errors.servingUnit.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="calories" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Calories:
                        </label>
                        <Input
                            id="calories"
                            type="number"
                            step="any"
                            {...register("calories")}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="protein" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Protein(g):
                        </label>
                        <Input
                            id="protein"
                            type="number"
                            step="any"
                            {...register("protein")}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="carbs" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Carbs(g):
                        </label>
                        <Input
                            id="carbs"
                            type="number"
                            step="any"
                            {...register("carbs")}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="fat" className="text-sm uppercase tracking-widest text-muted-foreground">
                            {">"} Fat(g):
                        </label>
                        <Input
                            id="fat"
                            type="number"
                            step="any"
                            {...register("fat")}
                            className="bg-transparent border-none border-b border-border rounded-none focus-visible:ring-0 px-0"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-none border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest font-bold"
                >
                    [ EXECUTE_SAVE ]
                </Button>
            </form>
        </div>
    );
}
