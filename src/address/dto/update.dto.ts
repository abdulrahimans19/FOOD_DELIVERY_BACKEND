import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class updateAddressDto {
  @IsNotEmpty()
  building_name: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  landmark: string;

  @IsNotEmpty()
  city_name: string;

  @IsNotEmpty()
  district_name: string;

  @IsNotEmpty()
  pincode: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  address_id: string;

  @IsBoolean()
  @IsOptional()
  is_default: boolean;
}
