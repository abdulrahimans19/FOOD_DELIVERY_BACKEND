import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { UserService } from 'src/user/user.service';
  import { Order, orderStatus } from './schema/order.schema';
  import { Food } from 'src/shared/schema/food.schema';
  import { Cart } from 'src/cart/schema/cart.schema';
  import { Model } from 'mongoose';
  import { JwtPayload } from 'src/auth/stragtegies';
  import { OrderNotification } from './dto';
  import { Address } from 'src/address/schema/address.schema';
  import Stripe from 'stripe';
  import { ConfigService } from '@nestjs/config';
  import { sendPushNotification } from 'src/shared/utils/utils';
  import { User } from 'src/user/schema/user.schema';
  import { OrderGateway } from './order.gateway';
  
  @Injectable()
  export class OrderService {
    private stripe: Stripe;
  
    constructor(
      private readonly configService: ConfigService,
      @InjectModel(Order.name) private readonly orderModel: Model<Order>,
      @InjectModel(Food.name) private readonly foodModel: Model<Food>,
      @InjectModel(Address.name) private readonly addressModel: Model<Address>,
      @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
      @InjectModel(User.name) private readonly userModel: Model<User>,
      private readonly userService: UserService,
      private readonly orderGateway: OrderGateway,
    ) {
      this.stripe = new Stripe(
        this.configService.get<string>('STRIPE_SECRET_KEY'),
        {
          apiVersion: '2023-10-16',
        },
      );
    }
  
    async placeOrder(user: JwtPayload) {
      try {
        const userId = await this.userService.getUserIdByLoyaltyId(user);
        const userAddress = await this.addressModel.findOne({
          user_id: userId,
          is_default: true,
        });
  
        if (!userAddress) {
          throw new NotFoundException('User has no default address');
        }
  
        const cart: any = await this.cartModel
          .findOne({ user_id: userId })
          .populate({
            path: 'user_id',
            model: this.userModel,
            select: 'fcm_token',
          })
          .populate('products.food_id')
          .exec();
  
        if (!cart) {
          throw new ConflictException('user have no cart');
        }
        if (!cart.products || cart.products.length < 0) {
          throw new ConflictException('Cart is empty');
        }
        cart.products.forEach((product) => {
          if (product.food_id.quantity === 0) {
            throw new ConflictException(
              `${product.food_id.foodName} is out of stock`,
            );
          }
          if (product.food_id.quantity < product.count) {
            throw new ConflictException(
              `${product.food_id.foodName} is not enough quantity,only ${product.food_id.quantity} left`,
            );
          }
        });
  
        let totalPrice = 0;
  
        for (const product of cart.products) {
          const food = product.food_id;
          const quantity = product.count;
          const foodPrice = food.foodPrice;
          const offerPrice = food.offerPrice || foodPrice;
          const itemTotal = offerPrice * quantity;
          totalPrice += itemTotal;
          const paymentData = await this.orderModel.create({
            user_id: userId,
            order_time: Date.now(),
            food_price: foodPrice,
            address_id: userAddress._id,
            status: orderStatus.ORDER_CREATED,
            order_status: 1,
            food_id: food._id,
            count: quantity,
            price: itemTotal,
            resturent_id: food.restaurant_id,
            foodName: food.foodName,
          });
  
          const stripePay = await this.stripe.paymentIntents.create({
            amount: paymentData.price * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            description: 'transaction',
            metadata: {
              order_id: paymentData._id.toString(),
              user_id: paymentData.user_id.toString(),
              count: paymentData.count,
              food_id: paymentData.food_id.toString(),
              fcm_token: cart.user_id.fcm_token,
              foodName: paymentData.foodName,
            },
          });
  
          return stripePay.client_secret;
        }
      } catch (error) {
        console.error(error);
        throw new HttpException('Internal Server Error', 500);
      }
    }
  
    async payment(stripePay: any): Promise<any> {
      const paymentStatus = await this.stripe.paymentIntents.retrieve(
        stripePay.paymentIntentId,
      );
      try {
        const value: number = parseInt(paymentStatus.metadata.count, 10);
        if (paymentStatus.status === 'succeeded') {
          await sendPushNotification(
            paymentStatus.metadata.fcm_token,
            'you orderd succesfully',
            `You have orderd : ${paymentStatus.metadata.foodName}`,
          );
          await this.orderModel.updateOne(
            { _id: paymentStatus.metadata.order_id },
            { $set: { status: orderStatus.PAYMENT_SUCCESS, order_status: 2 } },
          );
          await this.foodModel.updateOne(
            { _id: paymentStatus.metadata.food_id },
            { $inc: { quantity: 0 - value } },
          );
          await this.cartModel.deleteOne({
            user_id: paymentStatus.metadata.user_id,
          });
          const emitAddress = await this.orderModel
            .findOne({
              _id: paymentStatus.metadata.order_id,
            })
            .populate('resturent_id address_id');
          const orderNotification: OrderNotification = {
            orderId: paymentStatus.metadata.order_id,
            userAddress: emitAddress.address_id,
            restaurantAddress: emitAddress.resturent_id,
          };
          this.orderGateway.server.emit('orderPlaced', orderNotification);
        }
        return { message: 'Payment success' };
      } catch (error) {
        console.error(error);
        await this.orderModel.updateOne(
          { _id: paymentStatus.metadata.order_id },
          { $set: { status: 'Payment failed', order_status: 0 } },
        );
      }
    }
    async updateStatus(data) {
      // try {
      const ordered = await this.orderModel
        .findOne({ _id: data })
        .populate({
          path: 'user_id',
          model: this.userModel,
          select: 'fcm_token',
        })
        .populate('food_id');
      if (!ordered) throw new ConflictException('There is no Order For this Id ');
      const user = ordered.user_id as any;
      const fcmToken = user.fcm_token;
      const food = ordered.food_id as any;
      const foodName = food.foodName;
      await this.orderModel.updateOne(
        { _id: data },
        { $set: { status: orderStatus.ORDER_READY, order_status: 3 } },
      );
      await sendPushNotification(
        fcmToken,
        'your Food Ready on Resturent Waiting For Delivery DeliveryBoy to Pickup',
        `You have orderd : ${foodName}`,
      );
      return { message: 'Order marked as ready from resturent side' };
      // } catch (error) {}
    }
    async updateFoodPicked(data) {
      // try {
      const ordered = await this.orderModel
        .findOne({ _id: data })
        .populate({
          path: 'user_id',
          model: this.userModel,
          select: 'fcm_token',
        })
        .populate('food_id');
      if (!ordered) throw new ConflictException('There is no Order For this Id ');
      const user = ordered.user_id as any;
      const fcmToken = user.fcm_token;
      const food = ordered.food_id as any;
      const foodName = food.foodName;
      await this.orderModel.updateOne(
        { _id: data },
        { $set: { status: orderStatus.ORDER_PICKUP, order_status: 4 } },
      );
      await sendPushNotification(
        fcmToken,
        'your Food Picked by DeliveryBoy On the Way for Delivery',
        `You have orderd : ${foodName}`,
      );
      return { message: 'Order Picked by Delivery Boy' };
      // } catch (error) {}
    }
  
    async updateDeliverdStatus(data) {
      const ordered = await this.orderModel
        .findOne({ _id: data.order_id })
        .populate({
          path: 'user_id',
          model: this.userModel,
          select: 'fcm_token',
        })
        .populate('food_id');
      if (!ordered) throw new ConflictException('There is no Order For this Id ');
      const user = ordered.user_id as any;
      const fcmToken = user.fcm_token;
      const food = ordered.food_id as any;
      const foodName = food.foodName;
      await this.orderModel.updateOne(
        { _id: data.order_id },
        { $set: { status: orderStatus.ORDER_DELIVERED, order_status: 5 } },
      );
      await sendPushNotification(
        fcmToken,
        'your order Deliverd SuccessFully ',
        `Your Order: ${foodName}`,
      );
      return { message: 'Deliverd success' };
    }
  
    async getOrders(user: JwtPayload, selectedOrderStatus: string) {
      const user_id = await this.userService.getUserIdByLoyaltyId(user);
      const query = { user_id: user_id };
      if (selectedOrderStatus) {
        if (selectedOrderStatus == 'OC') {
          query['status'] = orderStatus.ORDER_CREATED;
        } else if (selectedOrderStatus == 'OP') {
          query['status'] = orderStatus.ORDER_PICKUP;
        } else if (selectedOrderStatus == 'OD') {
          query['status'] = orderStatus.ORDER_DELIVERED;
        }
      }
      return await this.orderModel
        .find(query)
        .populate('food_id foodName')
        .populate('address_id')
        .populate({
          path: 'user_id',
          select: 'username email',
        })
        .sort({ created_at: -1 });
    }
    async getSingleOrder(id: string, user: JwtPayload) {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const order = await this.orderModel.findOne({ user_id: userId, _id: id });
      return order;
    }
  }
  