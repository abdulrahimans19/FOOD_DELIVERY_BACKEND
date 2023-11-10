
import { IsNumber, IsString, Min, Max, Length } from 'class-validator';

export class RestaurantRatingDto {
  @IsString()
  resturent_id: string;

  @IsNumber({}, { message: 'Rating should be a number' })
  @Min(1, { message: 'Rating should be between 1 and 5' })
  @Max(5, { message: 'Rating should be between 1 and 5' })
  number: number;

  @IsString()
  @Length(1, 255, { message: 'Text should be between 1 and 255 characters' })
  text: string;
}
