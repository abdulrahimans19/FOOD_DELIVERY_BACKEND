import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Restaurant } from "src/shared/schema/resturant.schema";
import { User } from "src/user/schema/user.schema";

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class ResturentRatings {
    @Prop({ ref: User.name, type: SchemaTypes.ObjectId })
    user_id: Types.ObjectId;

    @Prop()
    number: number

    @Prop({ ref: Restaurant.name, type: SchemaTypes.ObjectId})
    resturent_id: Types.ObjectId

    @Prop()
    text: string

}

export const resturentRating_schema = SchemaFactory.createForClass(ResturentRatings)