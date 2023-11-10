import {
    BadRequestException,
    ConflictException,
    Injectable,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Food } from 'src/shared/schema/food.schema';
  import { Restaurant } from 'src/shared/schema/resturant.schema';
  import { UserService } from 'src/user/user.service';
  import { JwtPayload } from 'src/auth/stragtegies';
  import { Order } from 'src/order/schema/order.schema';
  import { ResturentRatings } from './schema/rate-resturent.schema';
  import { FoodRatings } from './schema/rate-food.schema';
  import { FoodRatingDto, RestaurantRatingDto } from './dto';
  
  @Injectable()
  export class RatingsService {
    constructor(
      @InjectModel(Restaurant.name) private resturantModel: Model<Restaurant>,
      @InjectModel(Food.name) private foodModel: Model<Food>,
      @InjectModel(Order.name) private orderModel: Model<Order>,
      @InjectModel(FoodRatings.name) private foodRateModel: Model<FoodRatings>,
      @InjectModel(ResturentRatings.name)
      private resturentRateModel: Model<ResturentRatings>,
      private readonly userService: UserService,
    ) {}
  
    async addResturentRating(dto: RestaurantRatingDto, user: JwtPayload) {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const ordered = await this.orderModel.findOne({
        user_id: userId,
        resturent_id: dto.resturent_id,
      });
      if (!ordered)
        throw new ConflictException(
          'You havent purchased any product from this hotel',
        );
      const ratingExist = await this.resturentRateModel.findOne({
        user_id: userId,
        resturent_id: dto.resturent_id,
      });
      if (dto.number < 1 || dto.number > 5) {
        throw new BadRequestException('Rating should be between 1 and 5');
      }
      if (ratingExist) {
        throw new ConflictException('You have already rated this resturent');
      } else {
        const rating = await this.resturentRateModel.create({
          user_id: userId,
          resturent_id: dto.resturent_id,
          number: dto.number,
          text: dto.text,
        });
        await this.resturantModel.updateOne(
          {
            _id: dto.resturent_id,
          },
          {
            $push: { ratings: rating._id },
            $inc: { totalRatings: rating.number },
          },
        );
        const restaurant = await this.resturantModel.findById(dto.resturent_id);
        const totalRatings = restaurant.totalRatings;
        const averageRating =
          totalRatings > 0
            ? restaurant.totalRatings / restaurant.ratings.length
            : 0;
        await this.resturantModel.updateOne(
          { _id: dto.resturent_id },
          { $set: { averageRating } },
        );
  
        return { message: 'Resturent Rated succesfully' };
      }
    }
  
    async addFoodRating(dto:FoodRatingDto, user: JwtPayload) {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      const ordered = await this.orderModel.findOne({
        user_id: userId,
        food_id: dto.food_id,
      });
      if (!ordered) throw new ConflictException('You havent purchased this Food');
      const ratingExist = await this.foodRateModel.findOne({
        user_id: userId,
        food_id: dto.food_id,
      });
      if (dto.number < 1 || dto.number > 5) {
        throw new BadRequestException('Rating should be between 1 and 5');
      }
      if (ratingExist) {
        throw new ConflictException('You have already rated this food');
      } else {
        const rating = await this.foodRateModel.create({
          user_id: userId,
          food_id: dto.food_id,
          number: dto.number,
          text: dto.text,
        });
        await this.foodModel.updateOne(
          {
            _id: dto.food_id,
          },
          {
            $push: { ratings: rating._id },
            $inc: { totalRatings: rating.number },
          },
        );
        const foodRating = await this.foodModel.findById(dto.food_id);
        const totalRatings = foodRating.totalRatings;
        const averageRating =
          totalRatings > 0
            ? foodRating.totalRatings / foodRating.ratings.length
            : 0;
        await this.foodModel.updateOne(
          { _id: dto.food_id },
          { $set: { averageRating } },
        );
        return { message: 'Food Rated succesfully' };
      }
    }
  
  }
  