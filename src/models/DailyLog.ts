import mongoose, { Schema, Document, Model } from 'mongoose';
import { DailyLog as DailyLogType, ConsumedItem, MacroData } from '@/types';

// Interface for the Mongoose document
export interface IDailyLogDocument extends Omit<DailyLogType, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const MacroDataSchema = new Schema<MacroData>({
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
}, { _id: false });

const ConsumedItemSchema = new Schema<ConsumedItem>({
    id: { type: String, required: true }, // Keep original food ID or generated ID
    name: { type: String, required: true },
    servingSize: { type: Number, required: true },
    servingUnit: { type: String, required: true },
    macros: { type: MacroDataSchema, required: true },
    consumedAmount: { type: Number, required: true },
}, { _id: false });

const DailyLogSchema = new Schema<IDailyLogDocument>({
    date: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD
    items: [ConsumedItemSchema],
    totalMacros: { type: MacroDataSchema, required: true },
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
const DailyLogModel: Model<IDailyLogDocument> = mongoose.models.DailyLog || mongoose.model<IDailyLogDocument>('DailyLog', DailyLogSchema);

export default DailyLogModel;
