import mongoose, { Schema, Document, Model } from 'mongoose';
import { FoodItem, MacroData } from '@/types';

// Interface for the Mongoose document, extending the FoodItem type
// We omit 'id' because Mongoose uses '_id'
export interface IFoodDocument extends Omit<FoodItem, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const MacroDataSchema = new Schema<MacroData>({
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
}, { _id: false });

const FoodSchema = new Schema<IFoodDocument>({
    name: { type: String, required: true },
    servingSize: { type: Number, required: true },
    servingUnit: { type: String, required: true },
    macros: { type: MacroDataSchema, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true
    }
});

// Prevent model recompilation error in development
const FoodModel: Model<IFoodDocument> = mongoose.models.Food || mongoose.model<IFoodDocument>('Food', FoodSchema);

export default FoodModel;
