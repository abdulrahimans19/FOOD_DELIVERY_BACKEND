import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Food } from 'src/shared/schema/food.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class FoodRatings {
  @Prop({ ref: User.name, type: SchemaTypes.ObjectId })
  user_id: Types.ObjectId;

  @Prop()
  number: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Food.name })
  food_id: Types.ObjectId;

  @Prop()
  text: string;
}

export const foodRating_schema = SchemaFactory.createForClass(FoodRatings);
