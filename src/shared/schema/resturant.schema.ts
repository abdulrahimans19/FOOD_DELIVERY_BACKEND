import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Restaurant {
  @Prop({ ref: User.name, type: SchemaTypes.ObjectId, index: true })
  owner: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  cuisine_type: string;

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      zip: String,
      coordinates: Number,
    },
  })
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({
    type: [String],
  })
  documents: string[];

  @Prop()
  phone: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'ResturentRatings' }] })
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
    type: Number,
    default: 1,
  })
  average_delivery_time: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  free_delivery: boolean;

  @Prop({
    type: Number,
    default: 1,
  })
  min_order_value: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  approved: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isAvailable: boolean;
}
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
