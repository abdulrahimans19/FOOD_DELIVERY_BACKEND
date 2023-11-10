import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Address } from 'src/address/schema/address.schema';
import { Food } from 'src/shared/schema/food.schema';
import { Restaurant } from 'src/shared/schema/resturant.schema';
import { User } from 'src/user/schema/user.schema';

export enum orderStatus {
  ORDER_CREATED = 'ORDER CREATED',
  PAYMENT_SUCCESS = 'PAYMENT SUCCESS',
  ORDER_READY = 'FOOD READY ',
  ORDER_PICKUP = 'ORDER PICKED BY DELIVERY BOY',
  ORDER_DELIVERED = 'DELIVERED',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Food.name })
  food_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Restaurant.name })
  resturent_id: Types.ObjectId;

  @Prop()
  count: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Address.name })
  address_id: Types.ObjectId;
  @Prop()
  foodName: string;
  @Prop()
  food_price: number;

  @Prop()
  status: string;

  @Prop()
  expected_delivery_time: Date;

  @Prop({ default: 0 })
  delivery_charge: number;

  @Prop()
  price: number;

  @Prop()
  order_time: Date;

  @Prop()
  delivered_time: Date;

  @Prop()
  order_status: number;
}

export const order_schema = SchemaFactory.createForClass(Order);
