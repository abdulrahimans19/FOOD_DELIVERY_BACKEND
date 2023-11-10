import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Restaurant } from './resturant.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Food extends Document {
  @Prop({ ref: Restaurant.name, type: SchemaTypes.ObjectId, index: true })
  restaurant_id: Types.ObjectId;

  @Prop()
  foodImage: string;

  @Prop()
  foodName: string;

  @Prop({
    type: String,
    enum: ['veg', 'non-veg'],
  })
  mealType: string;

  @Prop({
    type: [String],
    enum: ['breakfast', 'lunch', 'dinner'],
  })
  suitableFor: string[];

  @Prop({ type: Number })
  quantity: number;

  @Prop()
  foodPrice: number;

  @Prop({
    type: Number,
    default: 0,
  })
  offerPrice: number;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'foodRatings' }] })
  ratings: Types.ObjectId[];

  @Prop({
    type: Number,
    default: 0,
  })
  totalRatings: number;
  @Prop({
    type: Number,
    default: 0,
  })
  averageRating: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  adminApproved: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
