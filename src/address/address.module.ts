import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, address_schema } from './schema/address.schema';
import { UserModule } from 'src/user/user.module';
import {
  Restaurant,
  RestaurantSchema,
} from 'src/shared/schema/resturant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: address_schema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    UserModule,
  ],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
