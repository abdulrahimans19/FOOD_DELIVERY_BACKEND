import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/stragtegies';
import { FoodRatingDto, RestaurantRatingDto } from './dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingService: RatingsService) {}

  @Post('resturents/add')
  addResturentRating(
    @Body() dto: RestaurantRatingDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.ratingService.addResturentRating(dto, user);
  }
  @Post('foods/add')
  addFoodRating(@Body() dto: FoodRatingDto, @GetUser() user: JwtPayload) {
    return this.ratingService.addFoodRating(dto, user);
  }
}
