import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { addToCartDto } from './dto';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/stragtegies';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  addToCart(@Body() dto: addToCartDto, @GetUser() user: JwtPayload) {
    return this.cartService.addToCart(dto, user);
  }
  @Post('/decrease')
  reduceQuantityInCart(@Body() dto: addToCartDto, @GetUser() user: JwtPayload) {
    return this.cartService.reduceQuantityInCart(dto, user);
  }
  @Post('/remove')
  removeProductFromCart(@Body() dto, @GetUser() user: JwtPayload) {
    return this.cartService.removeProductFromCart(dto, user);
  }
}
