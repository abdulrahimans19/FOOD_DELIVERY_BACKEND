import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser, Public } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/stragtegies';
import { placeOrderDto } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/place-order')
  placeOrder(@Body() dto: placeOrderDto, @GetUser() user: JwtPayload) {
    return this.orderService.placeOrder(user);
  }

  @Public()
  @Post('/payment')
  payment(
    @Body() stripePay: any,
    // @GetUser() user: JwtPayload
  ) {
    return this.orderService.payment(stripePay);
  }

  @Get()
  getOrders(@GetUser() user: JwtPayload, @Query('status') status: string) {
    return this.orderService.getOrders(user, status);
  }
  @Get('/:id')
  getSingleOrder(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.orderService.getSingleOrder(id, user);
  }
}
