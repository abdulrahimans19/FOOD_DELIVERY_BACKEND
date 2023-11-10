import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantSchema,
} from 'src/shared/schema/resturant.schema';
import { Food, FoodSchema } from 'src/shared/schema/food.schema';
import { UserModule } from 'src/user/user.module';
import { Order, order_schema } from 'src/order/schema/order.schema';
import {
  ResturentRatings,
  resturentRating_schema,
} from './schema/rate-resturent.schema';
import { FoodRatings, foodRating_schema } from './schema/rate-food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResturentRatings.name, schema: resturentRating_schema },
      { name: FoodRatings.name, schema: foodRating_schema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Order.name, schema: order_schema },
      { name: Food.name, schema: FoodSchema },
    ]),
    UserModule,
  ],
  providers: [RatingsService],
  controllers: [RatingsController],
})
export class RatingsModule {}
