import mongoose, { Schema, Document, Model } from 'mongoose';
import { MacroData } from '@/types';

export interface ISubmittedLogDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    date: string;
    totalMacros: MacroData;
    createdAt: Date;
    updatedAt: Date;
}

const MacroDataSchema = new Schema<MacroData>({
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
}, { _id: false });

const SubmittedLogSchema = new Schema<ISubmittedLogDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    totalMacros: { type: MacroDataSchema, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    },
});

const SubmittedLogModel: Model<ISubmittedLogDocument> =
    mongoose.models.SubmittedLog || mongoose.model<ISubmittedLogDocument>('SubmittedLog', SubmittedLogSchema);

export default SubmittedLogModel;
