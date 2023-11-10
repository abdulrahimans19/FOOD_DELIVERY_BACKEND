import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/shared/decorators';
import { JwtPayload } from 'src/auth/stragtegies';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getUserProfile(@Req() req, @GetUser() user: JwtPayload) {
    const token = req.headers.authorization.split(' ')[1];
    return this.userService.getUserProfile(token);
  }

  // @Get('/get-user-role')
  // getUserRole(@GetUser() user: JwtPayload) {
  //   return this.userService.getUserRole(user);
  // }

  @Post('/update-fcm')
  updateFcmToken(@Body('fcm') fcm: string, @GetUser() user: JwtPayload) {
    return this.userService.updateFcmToken(fcm, user);
  }
}
