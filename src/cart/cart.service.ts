import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Cart } from './schema/cart.schema';
  import { UserService } from 'src/user/user.service';
  import { Model, Types } from 'mongoose';
  import { addToCartDto } from './dto';
  import { JwtPayload } from 'src/auth/stragtegies';
  import { Food } from 'src/shared/schema/food.schema';
  
  @Injectable()
  export class CartService {
    constructor(
      @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
      @InjectModel(Food.name) private readonly foodModel: Model<any>,
      private readonly userService: UserService,
    ) {}
  
    async addToCart(dto: addToCartDto, user: JwtPayload): Promise<Cart> {
      const food = await this.foodModel.findOne({ _id: dto.food_id });
      if (!food) throw new ConflictException('food not avilable to order');
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const userCart = await this.cartModel.findOne({ user_id:userId });
      if (!userCart) {
        const newCart = new this.cartModel({
          user_id: userId,
          products: [{ food_id: new Types.ObjectId(dto.food_id), count: 1 }],
        });
        return newCart.save();
      } else {
        const cartProduct = userCart.products.find(
          (foods) => foods.food_id.toString() === dto.food_id,
        );
        if (cartProduct) {
          if (cartProduct.count + 1 > food.quantity)
            throw new ConflictException(`Only ${food.quantity} left`);
        }
        const existingProduct = userCart.products.findIndex(
          (foods) => foods.food_id.toString() === dto.food_id,
        );
        if (existingProduct === -1) {
          userCart.products.push({
            food_id: new Types.ObjectId(dto.food_id),
            count: 1,
          });
        } else {
          userCart.products[existingProduct].count += 1;
        }
        return userCart.save();
      }
    }
  
    async reduceQuantityInCart(
      dto: addToCartDto,
      user: JwtPayload,
    ): Promise<Cart> {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const userCart = await this.cartModel.findOne({ user_id: userId });
      if (!userCart) {
        throw new ConflictException('User does not have a cart');
      }
      const excistingCart = userCart.products.findIndex(
        (foods) => foods.food_id.toString() === dto.food_id,
      );
  
      if (excistingCart === -1) {
        throw new ConflictException('Foods not find in Cart');
      }
  
      if (userCart.products[excistingCart].count > 1) {
        userCart.products[excistingCart].count -= 1;
      } else {
        userCart.products.splice(excistingCart, 1);
      }
      return userCart.save();
    }
  
    async removeProductFromCart(dto, user: JwtPayload): Promise<Cart> {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const userCart = await this.cartModel.findOne({ user_id: userId });
      if (!userCart) {
        throw new ConflictException('user does not have a cart');
      }
      const excistCart = userCart.products.findIndex(
        (foods) => foods.food_id.toString() === dto.food_id,
      );
      if (excistCart === -1) {
        throw new ConflictException('Cart not found');
      }
      userCart.products.splice(excistCart, 1);
      return userCart.save();
    }
  }
  