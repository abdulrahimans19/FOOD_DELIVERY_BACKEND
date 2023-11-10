import { IsNotEmpty, IsString } from 'class-validator';

export class cartCheckoutDto {
  @IsNotEmpty()
  @IsString()
  address_id: string;
}
