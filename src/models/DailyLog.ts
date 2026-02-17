import mongoose, { Schema, Document, Model } from 'mongoose';
import { DailyLog as DailyLogType, ConsumedItem, MacroData } from '@/types';

export interface IDailyLogDocument extends Omit<DailyLogType, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}

const MacroDataSchema = new Schema<MacroData>({
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
}, { _id: false });

const ConsumedItemSchema = new Schema<ConsumedItem>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    servingSize: { type: Number, required: true },
    servingUnit: { type: String, required: true },
    macros: { type: MacroDataSchema, required: true },
    consumedAmount: { type: Number, required: true },
}, { _id: false });

const DailyLogSchema = new Schema<IDailyLogDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
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

DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLogModel: Model<IDailyLogDocument> = mongoose.models.DailyLog || mongoose.model<IDailyLogDocument>('DailyLog', DailyLogSchema);

export default DailyLogModel;
