import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Address } from './schema/address.schema';
  import { Model } from 'mongoose';
  import { JwtPayload } from 'src/auth/stragtegies';
  import { UserService } from 'src/user/user.service';
  import { CreateAddressDto, LocationDto, updateAddressDto } from './dto';
  import { Restaurant } from 'src/shared/schema/resturant.schema';
  
  @Injectable()
  export class AddressService {
    constructor(
      @InjectModel(Address.name) private addressModel: Model<Address>,
      @InjectModel(Restaurant.name) private resturantModel: Model<Restaurant>,
  
      private readonly userService: UserService,
    ) {}
  
    async getUserAddress(user: JwtPayload) {
      const user_id = await this.userService.getUserIdByLoyaltyId(user);
      return await this.addressModel.find({ user_id }).sort({ created_at: -1 });
    }
  
    async getOneAddress(address_id: string) {
      return await this.addressModel.findOne({ _id: address_id });
    }
  
    async addAddress(dto: CreateAddressDto, user: JwtPayload) {
      try {
        const user_id = await this.userService.getUserIdByLoyaltyId(user);
        if (dto?.is_default) {
          await this.addressModel.updateMany(
            { user_id },
            { $set: { is_default: false } },
          );
        }
        const address = await this.addressModel.create({ ...dto, user_id });
        return address;
      } catch (error) {
        console.log(error);
      }
    }
  
    async getDefaultAddress(user: JwtPayload) {
      const userId = await this.userService.getUserIdByLoyaltyId(user);
      console.log(userId);
      const add = await this.addressModel.findOne({
        user_id: userId,
        is_default: true,
      });
      if (!add) return { message: 'No Default Address' };
      console.log(add);
      return add;
    }
  
    async makeAddressDefault(address_id: string, user: JwtPayload) {
      const user_id = await this.userService.getUserIdByLoyaltyId(user);
      await this.addressModel.updateMany(
        { user_id },
        { $set: { is_default: false } },
      );
      console.log(address_id);
      const default_address = await this.addressModel.findOneAndUpdate(
        { _id: address_id },
        { $set: { is_default: true } },
        { new: true },
      );
      console.log(default_address);
      return { message: 'Address set default' };
    }
  
    async editAddress(dto: updateAddressDto, user: JwtPayload) {
      const user_id = await this.userService.getUserIdByLoyaltyId(user);
      const update = await this.addressModel.updateOne(
        { _id: dto.address_id, user_id },
        { $set: dto },
      );
      console.log(update);
      return { message: 'updated succesfully' };
    }
  
    async deleteAddress(id: string, user: JwtPayload) {
      const user_id = await this.userService.getUserIdByLoyaltyId(user);
      await this.addressModel.deleteOne({ _id: id });
      return { message: 'address deleted succesfully' };
    }
  
    async updateLocation(user, dto) {
      try {
        const userId = await this.userService.getUserIdByLoyaltyId(user);
        const userToUpdate = await this.addressModel.findOne({ user_id: userId });
        console.log(userToUpdate);
        if (!userToUpdate) {
          return 'User not found';
        }
        const coordinates = dto.coordinates;
        if (
          coordinates &&
          Array.isArray(coordinates) &&
          coordinates.length === 2
        ) {
          const [latitude, longitude] = coordinates;
          userToUpdate.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          };
          await userToUpdate.save();
          return 'Location updated';
        } else {
          return 'Invalid coordinates format';
        }
      } catch (error) {
        console.error(error);
        return 'An error occurred while updating the location';
      }
    }
  
    // async getNearbyRestaurants(user: JwtPayload) {
    //   try {
    //     const userId = await this.userService.getUserIdByLoyaltyId(user);
    //     const loggedInUser = await this.addressModel.findOne({ user_id: userId });
  
    //     if (!loggedInUser) {
    //       throw new NotFoundException('User not found');
    //     }
    //     if (!loggedInUser.location || !loggedInUser.location.coordinates) {
    //       throw new ConflictException('User  location is not set.');
    //     }
  
    //     const userLongitude = loggedInUser.location.coordinates[1];
    //     const userLatitude = loggedInUser.location.coordinates[0];
    //     const maxDistance = 30 * 5000;
    //     const restaurants = await this.resturantModel.aggregate([
    //       {
    //         $geoNear: {
    //           near: {
    //             type: 'Point',
    //             coordinates: [userLongitude, userLatitude],
    //           },
    //           distanceField: 'distance',
    //           maxDistance: maxDistance,
    //           spherical: true,
    //         },
    //       },
    //       {
    //         $match: {
    //           // Optionally filter restaurants if needed
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           restaurant: '$$ROOT',
    //           distance: { $divide: ['$distance', 1000] },
    //         },
    //       },
    //       {
    //         $sort: {
    //           distance: 1,
    //         },
    //       },
    //     ]);
  
    //     return restaurants;
    //   } catch (err) {
    //     console.error(err.message);
    //   }
    // }
  }
  