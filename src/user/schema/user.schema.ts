import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  loyalty_id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String })
  fcm_token: string;

  @Prop({ type: String, default: 'User' })
  roles: string;

  @Prop({ required: true, default: true })
  is_active: boolean;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;

  @Prop({ required: true, default: '0.0.0.0' })
  ip_address: string;
}

export const user_schema = SchemaFactory.createForClass(User);

user_schema.pre('save', async function (next: (err?: Error) => void) {
  try {
    if (!this.isModified('username')) {
      const username = this['email'].split('@')[0];
      this['username'] = username;
      return next();
    }
    return next();
  } catch (error) {
    throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
  }
});

export enum UserRoles {
  ADMIN = 'Admin',
  USER = 'User',
  Dietitian  = 'Dietitian',
}
