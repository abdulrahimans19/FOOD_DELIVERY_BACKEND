import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export type SearchCriteria = {
  cuisine_type?: RegExp;
  startDate?: string;
  endDate?: string;
};
export class RestaurantDto {
  // @IsEnum(FoodType, {
  //   message: 'Invalid FoodType ',
  // })
  // // @IsNotEmpty()
  //  mealType: FoodType;
}
