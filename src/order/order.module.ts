import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from 'src/shared/schema/food.schema';
import { Cart, cart_schema } from 'src/cart/schema/cart.schema';
import { Order, order_schema } from './schema/order.schema';
import { Address, address_schema } from 'src/address/schema/address.schema';
import { User, user_schema } from 'src/user/schema/user.schema';
import { OrderGateway } from './order.gateway';
import { WebSocketClientService } from './order.client-gateway';
import { WebSocketDeliverClientService } from './order.deliverd-gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Cart.name, schema: cart_schema },
      { name: Order.name, schema: order_schema },
      { name: Address.name, schema: address_schema },
      { name: User.name, schema: user_schema },
    ]),
    UserModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderGateway,
    WebSocketClientService,
    WebSocketDeliverClientService,
  ],
})
export class OrderModule {}
