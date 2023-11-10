import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface OrderNotification {
  orderId: any;
  userAddress: any;
  restaurantAddress: any;
}

export class placeOrderDto {
  // @IsNotEmpty()
  // @IsNumber()
  // quantity: number;
  // @IsNotEmpty()
  // @IsString()
  // food_id: string;
  // @IsNotEmpty()
  // @IsString()
  // address_id: string;
}
