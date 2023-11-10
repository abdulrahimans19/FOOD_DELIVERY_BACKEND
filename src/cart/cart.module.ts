import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cart_schema } from './schema/cart.schema';
import { UserModule } from 'src/user/user.module';
import { Food, FoodSchema } from 'src/shared/schema/food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: cart_schema },
      { name: Food.name, schema: FoodSchema },
    ]),
    UserModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
