"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create New Food</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Food Name</Label>
                        <Input id="name" {...register("name")} placeholder="e.g., Banana" />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="servingSize">Serving Size</Label>
                            <Input
                                id="servingSize"
                                type="number"
                                step="any"
                                {...register("servingSize")}
                            />
                            {errors.servingSize && (
                                <p className="text-sm text-red-500">
                                    {errors.servingSize.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="servingUnit">Unit</Label>
                            <Input
                                id="servingUnit"
                                {...register("servingUnit")}
                                placeholder="g, oz, cup"
                            />
                            {errors.servingUnit && (
                                <p className="text-sm text-red-500">
                                    {errors.servingUnit.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input
                                id="calories"
                                type="number"
                                step="any"
                                {...register("calories")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                                id="protein"
                                type="number"
                                step="any"
                                {...register("protein")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                                id="carbs"
                                type="number"
                                step="any"
                                {...register("carbs")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fat">Fat (g)</Label>
                            <Input
                                id="fat"
                                type="number"
                                step="any"
                                {...register("fat")}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Save Food
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
