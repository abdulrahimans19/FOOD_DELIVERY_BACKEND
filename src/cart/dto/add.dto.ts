import { IsNotEmpty, IsString } from "class-validator";

export class addToCartDto {
    @IsNotEmpty()
    @IsString()
    food_id: string;
}