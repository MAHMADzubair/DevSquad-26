import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ─── Reply sub-document ──────────────────────────────────────────────────────
export class Reply {
  @Prop({ type: Types.ObjectId, required: true }) authorId: Types.ObjectId;
  @Prop({ required: true }) authorName: string;
  @Prop({ required: true }) body: string;
  @Prop({ default: Date.now }) createdAt: Date;
}

// ─── Review document ─────────────────────────────────────────────────────────
@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ required: true }) authorName: string;

  @Prop({ required: true, min: 1, max: 5 }) rating: number;

  @Prop({ required: true }) body: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({
    type: [
      {
        authorId: { type: Types.ObjectId, ref: 'User' },
        authorName: String,
        body: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  replies: Reply[];

  @Prop({ default: false }) flagged: boolean;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
