import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    ValidationPipe,
  } from '@nestjs/common';
  import { CreateAddressDto, LocationDto, updateAddressDto } from './dto';
  import { GetUser } from 'src/shared/decorators';
  import { JwtPayload } from 'src/auth/stragtegies';
  import { AddressService } from './address.service';
  
  @Controller('address')
  export class AddressController {
    constructor(private readonly addressService: AddressService) {}
  
    @Get()
    getUserAddress(@GetUser() user: JwtPayload) {
      return this.addressService.getUserAddress(user);
    }
  
    // @Get('nearby-resturant')
    // getNearbyRestaurants(@GetUser() user: JwtPayload) {
    //   return this.addressService.getNearbyRestaurants(user);
    // }
  
    @Put('update-location')
    updateLocation(@Body() dto, @GetUser() user) {
      return this.addressService.updateLocation(user, dto);
    }
  
    @Get('default-address')
    getDefaultAddress(@GetUser() user: JwtPayload) {
      return this.addressService.getDefaultAddress(user);
    }
  
    @Get(':id')
    getOneAddress(@GetUser() user: JwtPayload, @Param('id') id: string) {
      return this.addressService.getOneAddress(id);
    }
  
    @Get('/make-default/:id')
    makeAddressDefault(@GetUser() user: JwtPayload, @Param('id') id: string) {
      return this.addressService.makeAddressDefault(id, user);
    }
  
    @Post('/add')
    addAddress(@Body() dto: CreateAddressDto, @GetUser() user: JwtPayload) {
      return this.addressService.addAddress(dto, user);
    }
  
    @Put('/update')
    updateAddress(@Body() dto: updateAddressDto, @GetUser() user: JwtPayload) {
      return this.addressService.editAddress(dto, user);
    }
  
    @Delete()
    deleteAddress(@Body('id') id: string, @GetUser() user: JwtPayload) {
      return this.addressService.deleteAddress(id, user);
    }
  }
  