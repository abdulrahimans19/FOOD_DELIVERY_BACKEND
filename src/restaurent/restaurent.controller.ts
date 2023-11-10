import { Controller, Get, Query } from '@nestjs/common';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/stragtegies';
import { RestaurantDto } from './dto';
import { RestaurantService } from './restaurent.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  getAllResaurent(
    @GetUser() user: JwtPayload,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('text') text?: string,
  ) {
    return this.restaurantService.getAllResaurent(offset, limit, text, user);
  }
  @Get('foods')
  getFoods(
    @Query('mealType') mealType: string,
    @Query('suitableFor') suitableFor: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.restaurantService.getFoods(mealType, suitableFor,user);
  }

}
