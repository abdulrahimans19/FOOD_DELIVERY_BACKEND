import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, address_schema } from 'src/address/schema/address.schema';
import {
  Restaurant,
  RestaurantSchema,
} from 'src/shared/schema/resturant.schema';
import { UserModule } from 'src/user/user.module';
import { Food, FoodSchema } from 'src/shared/schema/food.schema';
import { RestaurantService } from './restaurent.service';
import { RestaurantController } from './restaurent.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: address_schema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Food.name, schema: FoodSchema },

    ]),
    UserModule,
  ],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
