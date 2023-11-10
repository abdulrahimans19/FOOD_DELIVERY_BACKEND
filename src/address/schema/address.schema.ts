import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Address {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop()
  building_name: string;

  @Prop()
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  landmark: string;
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

  @Prop()
  city_name: string;

  @Prop()
  district_name: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop()
  is_default: boolean;
}

export const address_schema = SchemaFactory.createForClass(Address);
//address_schema.index({ 'location.coordinates': '2dsphere' });
