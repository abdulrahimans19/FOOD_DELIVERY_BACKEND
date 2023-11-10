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
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop([
    {
      count: { type: Number, required: true },
      food_id: { type: SchemaTypes.ObjectId, ref: Food.name },
    },
  ])
  products: Array<{
    count: number;
    food_id: Types.ObjectId; 
  }>;
}

export const cart_schema = SchemaFactory.createForClass(Cart);
