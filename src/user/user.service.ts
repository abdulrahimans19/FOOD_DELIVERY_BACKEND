import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';

import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from 'src/auth/stragtegies';

@Injectable()
export class UserService { 
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async login(dto) {
    try {
      const loyalty_api = process.env.LOYALTY_API;
      const bodyFormData = { email: dto.email, password: dto.password };
      const response = await axios.post(
        `${loyalty_api}/auth/signin`,
        bodyFormData,
      );
      const userExists = await this.userModel.findOne({ email: dto.email });
      if (userExists) {
        return response.data.data;
      } else {
        console.log('NOT EXIST CREATING');
        const payload: { email: string; sub: string } = await jwtDecode(
          response.data.data.access_token,
        );

        const profileResponse = await axios.get(
          `${process.env.LOYALTY_API}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${response.data.data.access_token}`,
            },
          },
        );
        const details = {
          email: dto.email,
          username: profileResponse.data.data.username,
          loyalty_id: payload.sub,
          // community_id:profileResponse.data.data.community_id
        };
        console.log(details);
        const users = await this.userModel.create(details);
        return response.data.data;
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.response.data.data);
    }
  }

  async getUserById(id: string) {
    return await this.userModel.findOne({ loyalty_id: id });
  }

  async getUserProfile(loyalty_token: string) {
    try {
      const response = await axios.get(
        `${process.env.LOYALTY_API}/user/profile`,
        {
          headers: { Authorization: `Bearer ${loyalty_token}` },
        },
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      return error.response.data.data;
    }
  }

  async changUserRole(user_id: string, role: string) {
    await this.userModel.updateOne({ _id: user_id }, { $set: { roles: role } });
    return { message: 'Successfully updated' };
  }

  async getUserIdByLoyaltyId(user: JwtPayload) {
    const userData = await this.userModel.findOne({ loyalty_id: user.sub });
    return userData._id.toString();
  }

  async updateFcmToken(fcm: string, user: JwtPayload) {
    await this.userModel.updateOne(
      { loyalty_id: user.sub },
      { $set: { fcm_token: fcm } },
    );
    return { message: 'Fcm token updated' };
  }
}
