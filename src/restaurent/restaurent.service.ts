import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from 'src/address/schema/address.schema';
import { Restaurant } from 'src/shared/schema/resturant.schema';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/auth/stragtegies';
import { RestaurantDto, SearchCriteria } from './dto';
import { Food } from 'src/shared/schema/food.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(Restaurant.name) private resturantModel: Model<Restaurant>,
    @InjectModel(Food.name) private foodModel: Model<Food>,

    private readonly userService: UserService,
  ) {}

  async getAllResaurent(
    offset: number = 0,
    limit: number = 10,
    text: string,
    user: JwtPayload,
  ) {
    if (isNaN(offset)) {
      offset = 0;
    }
    if (isNaN(limit)) {
      limit = 10;
    }
    if (!text) {
      text = '';
    }

    let criteria: SearchCriteria = {};
    if (text) {
      let regexText = new RegExp(text, 'i');
      criteria.cuisine_type = regexText;
    }
    const userId = await this.userService.getUserIdByLoyaltyId(user);
    const loggedInUser = await this.addressModel.findOne({ user_id: userId });
    const userLocation = loggedInUser.location;
    if (userLocation && userLocation.coordinates) {
      const userLongitude = userLocation.coordinates[1];
      const userLatitude = userLocation.coordinates[0];
      const maxDistance = 30 * 5000;

      const restaurants = await this.resturantModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [userLongitude, userLatitude],
            },
            distanceField: 'distance',
            maxDistance: maxDistance,
            spherical: true,
          },
        },
        {
          $match: criteria,
        },
        {
          $project: {
            _id: 0,
            restaurant: '$$ROOT',
            distance: { $divide: ['$distance', 1000] },
          },
        },
        {
          $sort: {
            distance: 1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ]);
      return restaurants;
    } else {
      const resturents = await this.resturantModel.aggregate([
        {
          $match: criteria,
        },
        {
          $facet: {
            allDocs: [{ $group: { _id: null, totalCount: { $sum: 1 } } }],
            paginationDocs: [
              { $sort: { createdAt: -1 } },
              { $skip: offset },
              { $limit: limit },
            ],
          },
        },
      ]);
      return resturents;
    }
  }

  async getFoods(mealType: string, suitableFor: string, user: JwtPayload) {
    const query = this.foodModel.find();
    if (mealType) {
      query.where('mealType').equals(mealType);
    }
    if (suitableFor) {
      query.where('suitableFor').equals(suitableFor);
    }
    return query.exec();
  }
}
